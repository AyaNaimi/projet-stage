<?php

namespace App\Http\Controllers;

use App\Models\MatierePremiere;
use App\Models\Produit;
use App\Models\Recette;
use App\Models\User;
use App\Services\CostEngineService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __construct(private CostEngineService $engine)
    {
    }

    public function index(Request $request)
    {
        try {
            $counts = [
                'total_produits' => Produit::where('is_recette', false)->count(),
                'total_matieres_premieres' => MatierePremiere::count(),
                'total_recettes' => Produit::where('is_recette', true)->count(),
                'total_utilisateurs' => User::count(),
            ];

            $produits = Produit::with(['categorie', 'user'])
                ->select([
                    'id',
                    'designation',
                    'categorie_id',
                    'type',
                    'genre',
                    'prix_vente',
                    'quantite_production_mensuelle',
                    'temps_production',
                    'cout_horaire_mod',
                    'grammage',
                    'created_at',
                    'updated_at',
                    'user_id',
                    'is_recette',
                ])
                ->where('is_recette', false)
                ->get();

            $costMetrics = collect();
            $warnings = [];

            try {
                $this->engine->preloadChargesGlobales();

                $costMetrics = $produits->map(function (Produit $produit) {
                    try {
                        $calculation = $this->engine->calculerCoutUnitaire($produit);
                        $prixVente = (float) ($produit->prix_vente ?? 0);
                        $coutUnitaire = (float) ($calculation['cout_unitaire'] ?? 0);
                        $marge = $prixVente > 0 ? $prixVente - $coutUnitaire : null;
                        $margePct = $prixVente > 0 && $coutUnitaire > 0
                            ? round((($prixVente - $coutUnitaire) / $prixVente) * 100, 2)
                            : null;

                        return [
                            'produit_id' => $produit->id,
                            'cout_unitaire' => $coutUnitaire,
                            'prix_vente' => $prixVente,
                            'marge' => $marge,
                            'marge_pct' => $margePct,
                            'non_rentable' => $prixVente > 0 && $coutUnitaire >= $prixVente,
                        ];
                    } catch (\Throwable) {
                        return [
                            'produit_id' => $produit->id,
                            'cout_unitaire' => 0,
                            'prix_vente' => (float) ($produit->prix_vente ?? 0),
                            'marge' => null,
                            'marge_pct' => null,
                            'non_rentable' => false,
                        ];
                    }
                });
            } catch (\Throwable $costException) {
                $warnings[] = 'Le moteur de calcul de coût n’a pas pu être utilisé : ' . $costException->getMessage();
            } finally {
                try {
                    $this->engine->clearChargesCache();
                } catch (\Throwable) {
                    // ignore cache cleanup failures
                }
            }

            $coutMoyen = $costMetrics->where('cout_unitaire', '>', 0)->avg('cout_unitaire');
            $margeMoyenne = $costMetrics->filter(fn ($item) => $item['marge_pct'] !== null)->avg('marge_pct');
            $produitsNonRentables = $costMetrics->filter(fn ($item) => $item['non_rentable'])->count();

            $productDistribution = $produits->groupBy(function (Produit $produit) {
                if ($produit->categorie?->categorie) {
                    return $produit->categorie->categorie;
                }

                if (!empty($produit->type)) {
                    return $produit->type;
                }

                if (!empty($produit->genre)) {
                    return $produit->genre;
                }

                return 'Autres';
            })->map(function ($items, $label) {
                return [
                    'categorie' => $label,
                    'produits_count' => $items->count(),
                ];
            })->values();

            $recentActivities = $this->buildRecentActivities();

            if (empty($produits->all())) {
                $warnings[] = 'Aucun produit disponible pour calculer les indicateurs de coût.';
            }

            $warnings[] = 'Aucun système de logs métier dédié n’est encore présent ; les activités récentes sont dérivées des timestamps existants.';

            $costEvolution = $this->buildMonthlyCostEvolution();

            return response()->json([
                'success' => true,
                'data' => [
                    'counts' => $counts,
                    'indicators' => [
                        'cout_revient_moyen' => $coutMoyen !== null ? round((float) $coutMoyen, 4) : null,
                        'marge_moyenne_pct' => $margeMoyenne !== null ? round((float) $margeMoyenne, 2) : null,
                        'produits_non_rentables' => $produitsNonRentables,
                        'simulations_active' => 0,
                    ],
                    'cost_evolution' => $costEvolution,
                    'product_distribution' => $productDistribution,
                    'recent_activities' => $recentActivities,
                    'warnings' => $warnings,
                ],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de charger les statistiques du dashboard.',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    private function buildRecentActivities(): array
    {
        $activities = collect();

        Produit::query()
            ->select(['id', 'designation', 'user_id', 'created_at', 'updated_at'])
            ->with('user')
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->each(function (Produit $produit) use ($activities) {
                $activities->push([
                    'entity' => 'produit',
                    'action' => $this->isUpdated($produit->created_at, $produit->updated_at) ? 'Modification produit' : 'Création produit',
                    'subject' => $produit->designation ?? 'Produit',
                    'user' => $produit->user?->name ?? 'Système',
                    'created_at' => $produit->updated_at?->toISOString() ?? $produit->created_at?->toISOString(),
                ]);
            });

        MatierePremiere::query()
            ->select(['id', 'nom', 'created_at', 'updated_at'])
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->each(function (MatierePremiere $matiere) use ($activities) {
                $activities->push([
                    'entity' => 'matiere_premiere',
                    'action' => $this->isUpdated($matiere->created_at, $matiere->updated_at) ? 'Mise à jour matière première' : 'Ajout matière première',
                    'subject' => $matiere->nom ?? 'Matière première',
                    'user' => 'Système',
                    'created_at' => $matiere->updated_at?->toISOString() ?? $matiere->created_at?->toISOString(),
                ]);
            });

        Recette::query()
            ->select(['id', 'produit_id', 'created_at', 'updated_at'])
            ->with('produit')
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->each(function (Recette $recette) use ($activities) {
                $activities->push([
                    'entity' => 'recette',
                    'action' => $this->isUpdated($recette->created_at, $recette->updated_at) ? 'Modification recette' : 'Création recette',
                    'subject' => $recette->produit?->designation ? 'Recette · ' . $recette->produit->designation : 'Recette',
                    'user' => 'Système',
                    'created_at' => $recette->updated_at?->toISOString() ?? $recette->created_at?->toISOString(),
                ]);
            });

        return $activities
            ->sortByDesc(fn ($activity) => $activity['created_at'])
            ->take(10)
            ->values()
            ->all();
    }

    private function isUpdated($createdAt, $updatedAt): bool
    {
        if (!$createdAt || !$updatedAt) {
            return false;
        }

        return $updatedAt->greaterThan($createdAt->copy()->addMinutes(1));
    }

    public function produitsNonRentables(): \Illuminate\Http\JsonResponse
    {
        $produits = Produit::where('is_recette', false)
            ->select([
                'id',
                'designation',
                'prix_vente',
                'quantite_production_mensuelle',
                'temps_production',
                'cout_horaire_mod',
                'grammage',
                'temps_machine',
                'produit_Etiq_id',
                'produit_Embalg_id',
                'produit_Embalg_S_id',
            ])
            ->get();

        $this->engine->preloadChargesGlobales();

        $result = $produits->map(function (Produit $produit) {
            $calcul = $this->engine->calculerCoutUnitaire($produit);
            $coutUnitaire = (float) ($calcul['cout_unitaire'] ?? 0);
            $prixVente = (float) ($produit->prix_vente ?? 0);
            $perteUnitaire = $prixVente - $coutUnitaire;

            return [
                'id' => $produit->id,
                'nom' => $produit->designation,
                'prix_vente' => $prixVente,
                'cout_unitaire' => $coutUnitaire,
                'perte_unitaire' => round($perteUnitaire, 4),
            ];
        })->filter(fn ($item) => $item['prix_vente'] <= $item['cout_unitaire'])->values();

        $this->engine->clearChargesCache();

        return response()->json([
            'success' => true,
            'data' => $result,
        ], 200);
    }

    private function buildMonthlyCostEvolution(): array
    {
        try {
            $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

            $rows = \App\Models\CoutHistorique::query()
                ->selectRaw("DATE_FORMAT(date_calcul, '%Y-%m') as month_key, AVG(cout_unitaire) as average_cost")
                ->where('date_calcul', '>=', $sixMonthsAgo->toDateString())
                ->groupBy('month_key')
                ->orderBy('month_key')
                ->get();

            $history = [];
            $cursor = $sixMonthsAgo->copy();

            for ($i = 0; $i < 6; $i++) {
                $key = $cursor->format('Y-m');
                $monthName = ucfirst($cursor->locale('fr')->translatedFormat('M'));
                $row = $rows->firstWhere('month_key', $key);

                $history[] = [
                    'month' => $monthName,
                    'value' => $row ? round((float) $row->average_cost, 2) : 0,
                ];

                $cursor->addMonth();
            }

            return $history;
        } catch (\Throwable $e) {
            return collect(range(0, 5))->map(function ($offset) {
                $cursor = Carbon::now()->subMonths(5)->startOfMonth()->addMonths($offset);
                return [
                    'month' => ucfirst($cursor->locale('fr')->translatedFormat('M')),
                    'value' => 0,
                ];
            })->toArray();
        }
    }
}
