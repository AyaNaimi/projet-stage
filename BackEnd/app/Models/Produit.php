<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'Code_produit',
        'designation',
        'type_quantite',
        'unite',
        'seuil_alerte',
        'stock_initial',
        'etat_produit',
        'marque',
        'logoP',
        'prix_vente',
        'user_id',
        'categorie_id',
        'suCat_id',
        'calibre_id',
        'type',
        'genre',
        'tva',
        'Dvie',
        'reference',
        'produit_Etiq_id',
        'produit_Embalg_id',
        'produit_Embalg_S_id',
        'unite_etiquette',
        'unite_embalage_primaire',
        'unite_embalage_secondaire',
    ];


    public function getLogoUrlAttribute()
    {
        if (!$this->logoP) {
            return null;
        }
        if (str_starts_with($this->logoP, 'http')) {
            return $this->logoP;
        }
        if (str_starts_with($this->logoP, '/storage/')) {
            return asset($this->logoP);
        }
        return asset('storage/' . $this->logoP);
    }

    public function categorie()
    {
        return $this->belongsTo(categorie::class, 'categorie_id');
    }
    public function souscategorie()
    {
        return $this->belongsTo(categorie::class, 'suCat_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function etiquette()
    {
        return $this->belongsTo(Produit::class, 'produit_Etiq_id');
    }

    public function Embalge()
    {
        return $this->belongsTo(Produit::class, 'produit_Embalg_id');
    }
    public function EmbalgeS()
    {
        return $this->belongsTo(Produit::class,'produit_Embalg_S_id');
    }
    public function calibre()
    {
        return $this->belongsTo(Calibre::class, 'calibre_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    
    public function lignesCommande()
    {
        return $this->hasMany(LigneCommande::class);
    }
    public function prixProduits()
{
    return $this->hasMany(PrixProduit::class,'produit_id');
}
public function historique()
{
    return $this->belongsTo(StockProduit::class, 'produit_id','id');
}
public function prixProduitsLast()
{
    return $this->hasOne(PrixProduit::class)
        ->where(function ($query) {
            $query->whereNull('dateFin') // Prix sans date de fin
                ->orWhere(function ($query) {
                    $query->where('dateDebut', '<=', now()) // date_debut <= aujourd'hui
                        ->where('dateFin', '>=', now()); // aujourd'hui <= date_fin
                });
        })
        ->orderByRaw('
            CASE 
                WHEN dateFin IS NULL THEN 1
                ELSE 2 
            END, dateDebut DESC
        ');
}

public function stockProduit()
{
    return $this->hasMany(StockProduit::class, 'produit_id');
}

    public function recettes()
    {
        return $this->hasMany(Recette::class);
    }

    public function getUnitCostAttribute()
    {
        // 1. Matières Premières
        $matiereCost = 0;
        foreach ($this->recettes as $recette) {
            if ($recette->matierePremiere) {
                // Coût = Quantité * Prix / (1 - Perte)
                $lossFactor = 1 - ($recette->perte / 100);
                if ($lossFactor > 0) {
                    $matiereCost += ($recette->quantite * $recette->matierePremiere->prix_achat) / $lossFactor;
                }
            }
        }

        // 2. MOD
        $modCost = $this->temps_production * $this->cout_horaire_mod;

        // 3. Packaging
        $packagingCost = 0;
        if ($this->etiquette) $packagingCost += $this->etiquette->unit_cost ?? 0;
        if ($this->Embalge) $packagingCost += $this->Embalge->unit_cost ?? 0;
        if ($this->EmbalgeS) $packagingCost += $this->EmbalgeS->unit_cost ?? 0;

        return round($matiereCost + $modCost + $packagingCost, 4);
    }

    protected $appends = ['logo_url', 'unit_cost'];

public function stock()
{
    return $this->hasMany(StockProduit::class, 'produit_id');
}
}
