<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recette extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'matiere_premiere_id',
        'matiere_premiere_nom',
        'quantite',
        'perte',
        'unite',
        'quantite_reelle',
    ];

    protected static function booted()
    {
        static::saving(function (Recette $recette) {
            if ($recette->quantite_reelle === null || $recette->quantite_reelle === "") {
                $quantite = (float) ($recette->quantite ?? 0);
                $perte = max(0, min(99.99, (float) ($recette->perte ?? 0)));
                $lossFactor = 1 - ($perte / 100);

                $recette->quantite_reelle = $lossFactor > 0
                    ? round($quantite / $lossFactor, 6)
                    : 0;
            }
        });
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function matierePremiere()
    {
        return $this->belongsTo(MatierePremiere::class, 'matiere_premiere_id');
    }
}
