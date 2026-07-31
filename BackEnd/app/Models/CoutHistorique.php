<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoutHistorique extends Model
{
    use HasFactory;

    protected $table = 'cout_historiques';

    protected $fillable = [
        'produit_id',
        'cout_unitaire',
        'marge_pct',
        'date_calcul',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
