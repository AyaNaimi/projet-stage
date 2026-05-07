<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recette extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function matierePremiere()
    {
        return $this->belongsTo(MatierePremiere::class, 'matiere_premiere_id');
    }
}
