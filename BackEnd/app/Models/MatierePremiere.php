<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatierePremiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prix_achat',
        'unite',
        'fournisseur_id',
        'photo_url',
        'famille_id',
        'type_id',
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function famille()
    {
        return $this->belongsTo(FamilleMatiere::class, 'famille_id');
    }

    public function type()
    {
        return $this->belongsTo(TypeMatiere::class, 'type_id');
    }

    public function historiques()
    {
        return $this->hasMany(MatierePremiereHistorique::class);
    }

    public function recettes()
    {
        return $this->hasMany(Recette::class);
    }
}
