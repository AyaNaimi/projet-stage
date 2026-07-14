<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Services\CostEngineService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * CostEngineController — API du moteur de calcul du coût de revient
 *
 * Endpoints :
 *  GET  /api/produits/{id}/cout-unitaire          → coût unitaire détaillé
 *  GET  /api/produits/{id}/cout-lot?quantite=N    → coût lot de N unités
 *  POST /api/produits/cout-batch                  → coûts d'une liste de produits
 *  GET  /api/cout-produits                        → tableau de bord tous les produits
 *  POST /api/produits/{id}/simuler-cout           → simulation what-if sans persistance
 */
class CostEngineController extends Controller
{
    public function __construct(private CostEngineService $engine) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Coût unitaire d'un produit
    // ─────────────────────────────────────────────────────────────────────────

    public function coutUnitaire(int $id)
    {
        try {
            $produit = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
            ])->findOrFail($id);

            $resultat = $this->engine->calculerCoutUnitaire($produit);

            return response()->json(['success' => true, 'data' => $resultat]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['error' => 'Produit introuvable.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Coût d'un lot (N unités)
    // ─────────────────────────────────────────────────────────────────────────

    public function coutLot(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'quantite' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $produit = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
            ])->findOrFail($id);

            $resultat = $this->engine->calculerCoutLot($produit, (int) $request->input('quantite'));

            return response()->json(['success' => true, 'data' => $resultat]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['error' => 'Produit introuvable.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calcul batch (plusieurs produits en un appel)
    // ─────────────────────────────────────────────────────────────────────────

    public function coutBatch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids'      => 'required|array|min:1',
            'ids.*'    => 'integer|min:1',
            'quantite' => 'nullable|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $ids      = $request->input('ids');
            $quantite = (int) $request->input('quantite', 1);

            $produits = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
            ])->whereIn('id', $ids)->get();

            $resultats = [];
            foreach ($produits as $produit) {
                $resultats[$produit->id] = $quantite > 1
                    ? $this->engine->calculerCoutLot($produit, $quantite)
                    : $this->engine->calculerCoutUnitaire($produit);
            }

            $idsIntrouvables = array_diff($ids, $produits->pluck('id')->toArray());

            return response()->json([
                'success'          => true,
                'data'             => $resultats,
                'ids_introuvables' => array_values($idsIntrouvables),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tableau de bord — tous les produits
    // ─────────────────────────────────────────────────────────────────────────

    public function tableau(Request $request)
    {
        try {
            $perPage = min((int) $request->input('per_page', 20), 100);

            $produits = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
                'categorie',
            ])->paginate($perPage);

            $resultats = $produits->map(function (Produit $produit) {
                $calcul = $this->engine->calculerCoutUnitaire($produit);
                return [
                    'produit_id'              => $produit->id,
                    'designation'             => $produit->designation,
                    'Code_produit'            => $produit->Code_produit,
                    'categorie'               => $produit->categorie?->categorie,
                    'cout_matieres'           => $calcul['cout_matieres'],
                    'cout_mod'                => $calcul['cout_mod'],
                    'cout_packaging'          => $calcul['cout_packaging'],
                    'cout_charges_indirectes' => $calcul['cout_charges_indirectes'],
                    'cout_unitaire'           => $calcul['cout_unitaire'],
                    'prix_vente'              => (float) $produit->prix_vente,
                    'marge'                   => $produit->prix_vente
                        ? round((float) $produit->prix_vente - $calcul['cout_unitaire'], 4)
                        : null,
                    'marge_pct'               => ($produit->prix_vente && $calcul['cout_unitaire'] > 0)
                        ? round((((float) $produit->prix_vente - $calcul['cout_unitaire']) / $calcul['cout_unitaire']) * 100, 2)
                        : null,
                ];
            });

            return response()->json([
                'success'    => true,
                'data'       => $resultats,
                'pagination' => [
                    'total'        => $produits->total(),
                    'per_page'     => $produits->perPage(),
                    'current_page' => $produits->currentPage(),
                    'last_page'    => $produits->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Simulation « what-if »
    // ─────────────────────────────────────────────────────────────────────────

    public function simulerCout(Request $request, int $id)    {
        try {
            $produit = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
            ])->findOrFail($id);

            $overrides = $request->only([
                'cout_horaire_mod',
                'temps_production',
                'quantite_production_mensuelle',
                'grammage',
                'temps_machine',
            ]);

            foreach ($overrides as $key => $value) {
                $produit->$key = $value;
            }

            $resultat = $this->engine->calculerCoutUnitaire($produit);

            return response()->json([
                'success'   => true,
                'simule'    => true,
                'overrides' => $overrides,
                'data'      => $resultat,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['error' => 'Produit introuvable.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Pricing & Marges
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * POST /api/produits/{id}/pricing
     *
     * Body JSON :
     * {
     *   "prix_vente": 2.5,       // optionnel — utilise prix_vente du produit si absent
     *   "marge_cible_pct": 20    // optionnel — défaut 20 %
     * }
     */
    public function pricing(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'prix_vente'      => 'nullable|numeric|min:0',
            'marge_cible_pct' => 'nullable|numeric|min:0|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $produit = Produit::with([
                'recettes.matierePremiere',
                'etiquette',
                'Embalge',
                'EmbalgeS',
            ])->findOrFail($id);

            $prixVente    = (float) $request->input('prix_vente', 0);
            $margeCible   = (float) $request->input('marge_cible_pct', 20);

            $resultat = $this->engine->calculerPricing($produit, $prixVente, $margeCible);

            return response()->json(['success' => true, 'data' => $resultat]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['error' => 'Produit introuvable.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
