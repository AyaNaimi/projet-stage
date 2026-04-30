<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;
    protected $guarded=[];

    // 1. Les produits qui appartiennent à cette catégorie
    public function produits()
    {
        return $this->hasMany(Produit::class, 'categorie_id');
    }

    // 2. Les SOUS-CATEGORIES (Types) qui appartiennent à cette catégorie (Famille)
    // Ex: Catégorie "Viande" a pour enfants "Boeuf", "Poulet"
    public function sousCategories()
    {
        return $this->hasMany(Categorie::class, 'parent_id');
    }

    // 3. La FAMILLE (Parent) de cette catégorie
    // Ex: Catégorie "Boeuf" appartient à la famille "Viande"
    public function famille()
    {
        return $this->belongsTo(Categorie::class, 'parent_id');
    }
}
