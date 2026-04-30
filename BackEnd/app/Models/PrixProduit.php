<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrixProduit extends Model
{
    use HasFactory;

    protected $table = 'prix_produits';

    protected $guarded = [];

    protected $casts = [
        'dateDebut' => 'datetime:Y-m-d',
        'dateFin' => 'datetime:Y-m-d',
        'prixProduit' => 'decimal:2',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
