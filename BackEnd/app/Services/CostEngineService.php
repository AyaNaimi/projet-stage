<?php

namespace App\Services;

use App\Models\Produit;
use App\Models\ChargeIndirecte;

/**
 * CostEngineService — Moteur de calcul du coût de revient
 *
 * Responsabilités :
 *  - Coût matières premières (avec prise en compte des pertes)
 *  - Coût MOD (Main d'Oeuvre Directe)
 *  - Coût packaging (étiquette + emballage primaire + emballage secondaire)
 *  - Répartition paramétrable des charges indirectes (volume / quantité / temps machine)
 *  - Calcul du coût unitaire et du coût lot (N unités)
 *  - Pricing & marges (marge brute, taux de marge, markup, prix minimum conseillé)
 *  - Décomposition traçable de chaque composante
 */
class CostEngineService
{
    /** Cache en mémoire pour optimiser le tableau de bord (plusieurs produits) */
    private ?\Illuminate\Support\Collection $chargesCache = null;
    private ?array $basesCache = null;

    /**
     * Pré-charge les charges indirectes et les bases globales une seule fois.
     * À appeler avant une boucle sur plusieurs produits.
     */
    public function preloadChargesGlobales(): void
    {
        $this->chargesCache = ChargeIndirecte::all();
        $this->basesCache   = $this->calculerBasesGlobales($this->chargesCache);
    }

    /**
     * Libère le cache en mémoire après utilisation.
     */
    public function clearChargesCache(): void
    {
        $this->chargesCache = null;
        $this->basesCache   = null;
    }
    /**
     * Calcule le coût unitaire complet avec le détail de chaque composante.
     *
     * @param  Produit $produit  Instance du produit avec ses relations chargées
     * @return array
     */
    public function calculerCoutUnitaire(Produit $produit): array
    {
        $produit->loadMissing([
            'recettes.matierePremiere',
            'etiquette',
            'Embalge',
            'EmbalgeS',
        ]);

        $detailMatieres  = $this->calculerMatieres($produit);
        $detailMod       = $this->calculerMod($produit);
        $detailPackaging = $this->calculerPackaging($produit);
        $detailCharges   = $this->calculerChargesIndirectes($produit);

        $coutUnitaire = round(
            $detailMatieres['total'] +
            $detailMod['total'] +
            $detailPackaging['total'] +
            $detailCharges['total'],
            4
        );

        return [
            'produit_id'              => $produit->id,
            'designation'             => $produit->designation,
            'cout_matieres'           => $detailMatieres['total'],
            'cout_mod'                => $detailMod['total'],
            'cout_packaging'          => $detailPackaging['total'],
            'cout_charges_indirectes' => $detailCharges['total'],
            'cout_unitaire'           => $coutUnitaire,
            'detail'                  => [
                'matieres'           => $detailMatieres,
                'mod'                => $detailMod,
                'packaging'          => $detailPackaging,
                'charges_indirectes' => $detailCharges,
            ],
        ];
    }

    /**
     * Calcule le coût d'un lot de N unités.
     */
    public function calculerCoutLot(Produit $produit, int $quantite): array
    {
        $base = $this->calculerCoutUnitaire($produit);

        return array_merge($base, [
            'quantite_lot'                => $quantite,
            'cout_lot'                    => round($base['cout_unitaire'] * $quantite, 4),
            'cout_matieres_lot'           => round($base['cout_matieres'] * $quantite, 4),
            'cout_mod_lot'                => round($base['cout_mod'] * $quantite, 4),
            'cout_packaging_lot'          => round($base['cout_packaging'] * $quantite, 4),
            'cout_charges_indirectes_lot' => round($base['cout_charges_indirectes'] * $quantite, 4),
        ]);
    }

    /**
     * Calcule la marge, le taux de marge, le markup et le prix minimum conseillé.
     *
     * @param  Produit $produit
     * @param  float   $prixVente     Prix de vente souhaité (0 = utiliser prix_vente du produit)
     * @param  float   $margeCiblePct Marge cible en % pour le prix minimum conseillé
     * @return array
     */
    public function calculerPricing(Produit $produit, float $prixVente = 0.0, float $margeCiblePct = 20.0): array
    {
        $calcul = $this->calculerCoutUnitaire($produit);
        $cout   = $calcul['cout_unitaire'];

        if ($prixVente <= 0) {
            $prixVente = (float) ($produit->prix_vente ?? 0);
        }

        $margeUnitaire = $prixVente - $cout;

        $tauxMarge = $prixVente > 0
            ? round(($margeUnitaire / $prixVente) * 100, 2)
            : null;

        $tauxMarkup = $cout > 0
            ? round(($margeUnitaire / $cout) * 100, 2)
            : null;

        // Prix min = cout / (1 - marge_cible/100)
        $prixMinConseille = ($cout > 0 && $margeCiblePct < 100)
            ? round($cout / (1 - ($margeCiblePct / 100)), 4)
            : null;

        return [
            'produit_id'         => $produit->id,
            'designation'        => $produit->designation,
            'cout_unitaire'      => $cout,
            'cout_matiere'       => $calcul['cout_matieres'],
            'cout_mod'           => $calcul['cout_mod'],
            'cout_packaging'     => $calcul['cout_packaging'],
            'cout_charges_ind'   => $calcul['cout_charges_indirectes'],
            'prix_vente'         => $prixVente,
            'marge_unitaire'     => round($margeUnitaire, 4),
            'taux_marge'         => $tauxMarge,
            'taux_markup'        => $tauxMarkup,
            'prix_min_conseille' => $prixMinConseille,
            'marge_cible_pct'    => $margeCiblePct,
            'rentable'           => $prixVente > 0 ? $prixVente >= $cout : null,
            'detail_cout'        => $calcul['detail'],
        ];
    }

    // -------------------------------------------------------------------------
    // Composantes de coût (privées)
    // -------------------------------------------------------------------------

    /**
     * Coût des matières premières.
     * Formule : quantite * prix_achat / (1 - perte/100)
     */
    private function calculerMatieres(Produit $produit): array
    {
        $lignes = [];
        $total  = 0.0;

        foreach ($produit->recettes as $recette) {
            $mp = $recette->matierePremiere;
            if (!$mp) {
                continue;
            }

            $perte      = max(0, min(99.99, (float) $recette->perte));
            $lossFactor = 1 - ($perte / 100);

            if ($lossFactor <= 0) {
                continue;
            }

            $coutLigne = ($recette->quantite * $mp->prix_achat) / $lossFactor;
            $total    += $coutLigne;

            $lignes[] = [
                'matiere_premiere_id'   => $mp->id,
                'nom'                   => $mp->nom,
                'quantite'              => (float) $recette->quantite,
                'unite'                 => $recette->unite,
                'perte_pct'             => $perte,
                'prix_achat_unitaire'   => (float) $mp->prix_achat,
                'quantite_reelle_achat' => round($recette->quantite / $lossFactor, 6),
                'cout'                  => round($coutLigne, 4),
            ];
        }

        return ['total' => round($total, 4), 'lignes' => $lignes];
    }

    /**
     * Coût MOD (Main d'Oeuvre Directe).
     * Formule : (temps_production minutes / 60) * cout_horaire_mod
     */
    private function calculerMod(Produit $produit): array
    {
        $temps       = (float) ($produit->temps_production ?? 0);
        $tauxHoraire = (float) ($produit->cout_horaire_mod ?? 0);
        $total       = ($temps / 60) * $tauxHoraire;

        return [
            'total'         => round($total, 4),
            'temps_minutes' => $temps,
            'taux_horaire'  => $tauxHoraire,
            'formule'       => "({$temps} min / 60) x {$tauxHoraire} DH/h",
        ];
    }

    /**
     * Coût du packaging.
     * Utilise prix_vente des composants pour éviter la récursion.
     */
    private function calculerPackaging(Produit $produit): array
    {
        $lignes = [];
        $total  = 0.0;

        $components = [
            'etiquette'  => $produit->etiquette,
            'embalage'   => $produit->Embalge,
            'embalage_s' => $produit->EmbalgeS,
        ];

        foreach ($components as $role => $composant) {
            if (!$composant) {
                continue;
            }

            $coutComposant = (float) ($composant->prix_vente ?? 0);
            $total        += $coutComposant;

            $lignes[] = [
                'role'        => $role,
                'produit_id'  => $composant->id,
                'designation' => $composant->designation,
                'cout'        => round($coutComposant, 4),
            ];
        }

        return ['total' => round($total, 4), 'lignes' => $lignes];
    }

    /**
     * Répartition des charges indirectes.
     * Méthodes : quantite / volume / temps_machine
     */
    private function calculerChargesIndirectes(Produit $produit): array
    {
        $qtyMensuelle = (float) ($produit->quantite_production_mensuelle ?? 0);

        if ($qtyMensuelle <= 0) {
            return [
                'total'  => 0.0,
                'lignes' => [],
                'raison' => 'quantite_production_mensuelle non definie ou nulle',
            ];
        }

        // Utiliser le cache si disponible (appel dans un contexte batch),
        // sinon faire la requête BD directement (appel unitaire).
        $charges = $this->chargesCache ?? ChargeIndirecte::all();
        $bases   = $this->basesCache   ?? $this->calculerBasesGlobales($charges);

        $lignes  = [];
        $total   = 0.0;

        foreach ($charges as $charge) {
            $nbMois         = $this->convertirFrequenceEnMois($charge->frequence);
            $montantMensuel = $nbMois > 0 ? ($charge->montant / $nbMois) : 0;

            $methode     = $charge->methode_repartition;
            $baseTotale  = $bases[$methode] ?? 0;
            $partProduit = $this->calculerPartProduit($produit, $methode);

            $coutAlloue = ($baseTotale > 0) ? $montantMensuel * ($partProduit / $baseTotale) : 0.0;
            $coutUnit   = $qtyMensuelle > 0 ? ($coutAlloue / $qtyMensuelle) : 0;
            $total     += $coutUnit;

            $lignes[] = [
                'charge_id'           => $charge->id,
                'nom'                 => $charge->nom,
                'montant_total'       => (float) $charge->montant,
                'frequence'           => $charge->frequence,
                'nb_mois'             => $nbMois,
                'montant_mensuel'     => round($montantMensuel, 4),
                'methode_repartition' => $methode,
                'base_totale'         => round($baseTotale, 4),
                'part_produit'        => round($partProduit, 4),
                'cout_alloue_mensuel' => round($coutAlloue, 4),
                'cout_unitaire'       => round($coutUnit, 6),
            ];
        }

        return ['total' => round($total, 4), 'lignes' => $lignes];
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function calculerBasesGlobales($charges): array
    {
        $methodes = $charges->pluck('methode_repartition')->unique()->values();
        $bases    = [];

        if ($methodes->contains('quantite')) {
            $bases['quantite'] = (float) Produit::sum('quantite_production_mensuelle');
        }
        if ($methodes->contains('volume')) {
            $bases['volume'] = (float) Produit::selectRaw(
                'SUM(COALESCE(grammage, 0) * COALESCE(quantite_production_mensuelle, 0)) as total'
            )->value('total');
        }
        if ($methodes->contains('temps_machine')) {
            $bases['temps_machine'] = (float) Produit::sum('temps_machine');
        }

        return $bases;
    }

    private function calculerPartProduit(Produit $produit, string $methode): float
    {
        return match ($methode) {
            'quantite'      => (float) ($produit->quantite_production_mensuelle ?? 0),
            'volume'        => (float) ($produit->grammage ?? 0) * (float) ($produit->quantite_production_mensuelle ?? 0),
            'temps_machine' => (float) ($produit->temps_machine ?? 0),
            default         => 0.0,
        };
    }

    public function convertirFrequenceEnMois(mixed $frequence): int
    {
        if (is_numeric($frequence) && (int) $frequence > 0) {
            return (int) $frequence;
        }

        return match ((string) $frequence) {
            'mensuel'     => 1,
            'trimestriel' => 3,
            'annuel'      => 12,
            default       => 1,
        };
    }
}
