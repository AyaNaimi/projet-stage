<?php

namespace App\Console\Commands;

use App\Models\Produit;
use App\Models\CoutHistorique;
use App\Services\CostEngineService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CoutSnapshot extends Command
{
    protected $signature = 'cout:snapshot';
    protected $description = 'Enregistre un snapshot mensuel du coût unitaire et de la marge de chaque produit.';

    public function handle(CostEngineService $engine): int
    {
        $this->info('Début du snapshot des coûts produits...');

        $today = Carbon::today();
        $monthKey = $today->format('Y-m');

        $produits = Produit::where('is_recette', false)
            ->select([
                'id',
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

        $engine->preloadChargesGlobales();

        $inserted = 0;
        foreach ($produits as $produit) {
            $calcul = $engine->calculerCoutUnitaire($produit);
            $coutUnitaire = (float) ($calcul['cout_unitaire'] ?? 0);

            $prixVente = (float) ($produit->prix_vente ?? 0);
            $margePct = $prixVente > 0
                ? round((($prixVente - $coutUnitaire) / $prixVente) * 100, 4)
                : null;

            $exists = CoutHistorique::query()
                ->where('produit_id', $produit->id)
                ->whereYear('date_calcul', $today->year)
                ->whereMonth('date_calcul', $today->month)
                ->exists();

            if ($exists) {
                continue;
            }

            CoutHistorique::create([
                'produit_id' => $produit->id,
                'cout_unitaire' => $coutUnitaire,
                'marge_pct' => $margePct,
                'date_calcul' => $today->toDateString(),
            ]);

            $inserted++;
        }

        $engine->clearChargesCache();

        $this->info("Snapshot terminé : $inserted ligne(s) insérée(s).");
        return 0;
    }
}
