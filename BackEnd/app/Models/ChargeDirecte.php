<?php

namespace App\Models;

class ChargeDirecte
{
    /**
     * Calcule le détail des charges directes d'un produit.
     */
    public function calculer(Produit $produit): array
    {
        // S'assurer que les relations sont chargées (évite le N+1)
        $produit->loadMissing([
            'recettes.matierePremiere',
            'packagingsUtilises.packaging.prixProduitsLast',
        ]);

        $coutMatieres = $this->calculerCoutMatieres($produit);
        $coutMod = $this->calculerCoutMod($produit);
        $coutPackaging = $this->calculerCoutPackaging($produit);

        $total = $coutMatieres + $coutMod + $coutPackaging;

        return [
            'cout_matieres_premieres' => round($coutMatieres, 4),
            'cout_main_oeuvre' => round($coutMod, 4),
            'cout_packaging' => round($coutPackaging, 4),
            'cout_revient_unitaire' => round($total, 4),
            'detail_matieres' => $this->detailMatieres($produit),
        ];
    }

    protected function calculerCoutMatieres(Produit $produit): float
    {
        $total = 0;

        foreach ($produit->recettes as $recette) {
            if (!$recette->matierePremiere) {
                continue;
            }

            $lossFactor = 1 - ($recette->perte / 100);
            if ($lossFactor <= 0) {
                continue; // evite division par zero / perte >= 100%
            }

            $total += ($recette->quantite * $recette->matierePremiere->prix_achat) / $lossFactor;
        }

        return $total;
    }

    protected function calculerCoutMod(Produit $produit): float
{
    $temps = $produit->temps_production ?? 0; // en minutes
    $tauxHoraire = $produit->cout_horaire_mod ?? 0;
    $perte = $produit->perte_mod ?? 0;

    // Convertir le temps en heures (diviser par 60)
    $tempsEnHeures = $temps / 60;

    $lossFactor = 1 - ($perte / 100);
    if ($lossFactor <= 0) {
        return 0;
    }

    return ($tempsEnHeures * $tauxHoraire) / $lossFactor;
}

    protected function calculerCoutPackaging(Produit $produit): float
    {
        $total = 0;
        foreach ($produit->packagingsUtilises as $ligne) {
            if (!$ligne->packaging) {
                continue;
            }

            $lossFactor = 1 - ($ligne->perte / 100);
            if ($lossFactor <= 0) {
                continue;
            }

            $prixUnitaire = $ligne->packaging->prixProduitsLast->prixProduit ?? 0;
            $total += ($ligne->quantite * $prixUnitaire) / $lossFactor;
        }
        return $total;
    }

    protected function detailMatieres(Produit $produit): array
    {
        return $produit->recettes->map(function ($recette) {
            $lossFactor = 1 - ($recette->perte / 100);
            $coutLigne = $lossFactor > 0
                ? ($recette->quantite * ($recette->matierePremiere->prix_achat ?? 0)) / $lossFactor
                : 0;

            return [
                'matiere_premiere' => $recette->matierePremiere->nom ?? null,
                'quantite' => $recette->quantite,
                'perte_pct' => $recette->perte,
                'prix_unitaire' => $recette->matierePremiere->prix_achat ?? null,
                'cout_ligne' => round($coutLigne, 4),
            ];
        })->toArray();
    }

    public function getDernierCoutMOD(Produit $produit): array
{
    $historique = $produit->historiqueMODLast;
    
    if ($historique) {
        return [
            'cout_horaire_mod' => $historique->cout_horaire_mod,
            'temps_production' => $historique->temps_production,
            'perte_mod' => $historique->perte_mod,
            'date_debut' => $historique->date_debut,
        ];
    }
    
    return [
        'cout_horaire_mod' => $produit->cout_horaire_mod ?? 0,
        'temps_production' => $produit->temps_production ?? 0,
        'perte_mod' => $produit->perte_mod ?? 0,
        'date_debut' => null,
    ];
}


public function calculerCoutLot(Produit $produit, float $quantite): array
{
    $detail = $this->calculer($produit);
    $coutUnitaire = $detail['cout_revient_unitaire'];
    
    $coutTotal = $coutUnitaire * $quantite;
    
    return [
        'cout_unitaire' => $coutUnitaire,
        'quantite' => $quantite,
        'cout_total' => $coutTotal,
        'detail' => $detail
    ];
}

public function verifierCoherenceCalcul(Produit $produit): array
{
    $detail = $this->calculer($produit);

    $sommeComposants = $detail['cout_matieres_premieres']
        + $detail['cout_main_oeuvre']
        + $detail['cout_packaging'];

    $ecart = abs($sommeComposants - $detail['cout_revient_unitaire']);

    return [
        'coherent' => $ecart < 0.01,
        'ecart' => round($ecart, 4),
        'somme_composants' => round($sommeComposants, 4),
        'total_annonce' => $detail['cout_revient_unitaire'],
        'detail' => [
            'cout_matieres_premieres' => $detail['cout_matieres_premieres'],
            'cout_main_oeuvre' => $detail['cout_main_oeuvre'],
            'cout_packaging' => $detail['cout_packaging'],
        ],
    ];
}
public function validerCoutUnitaire(Produit $produit): array
{
    $detail = $this->calculer($produit);
    $coutUnitaire = $detail['cout_revient_unitaire'];
    $prixVente = $produit->prix_vente ?? 0;
    $marge = $prixVente - $coutUnitaire;
    $margePourcentage = $prixVente > 0 ? ($marge / $prixVente) * 100 : 0;

    if ($prixVente == 0) {
        $statut = 'info';
        $message = 'Prix de vente non defini.';
    } elseif ($marge < 0) {
        $statut = 'danger';
        $message = 'Attention : Prix de vente inferieur au cout de revient.';
    } elseif ($margePourcentage < 10) {
        $statut = 'warning';
        $message = 'Marge faible (moins de 10%).';
    } else {
        $statut = 'success';
        $message = 'Marge correcte.';
    }

    return [
        'cout_unitaire' => round($coutUnitaire, 2),
        'prix_vente' => round($prixVente, 2),
        'marge' => round($marge, 2),
        'marge_pourcentage' => round($margePourcentage, 2),
        'statut' => $statut,
        'message' => $message,
    ];
}
public function calculerPrixMinimum(Produit $produit, float $margeSouhaitee = 20): array
{
    $detail = $this->calculer($produit);
    $coutUnitaire = $detail['cout_revient_unitaire'];
    
    $prixMinimum = $coutUnitaire + ($coutUnitaire * $margeSouhaitee / 100);
    
    return [
        'cout_unitaire' => round($coutUnitaire, 2),
        'marge_souhaitee' => $margeSouhaitee,
        'prix_minimum' => round($prixMinimum, 2),
    ];
}
}