<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueMOD extends Model
{
    protected $fillable = [
    'produit_id',
    'cout_horaire_mod',
    'temps_production',
    'perte_mod',
    'quantite',
    'cout_total',
    'date_debut',
    'date_fin',
    'user_id',
];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}