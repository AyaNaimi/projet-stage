<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProduitPackaging extends Model
{
    protected $guarded = [];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    public function packaging()
    {
        return $this->belongsTo(Produit::class, 'packaging_id');
    }
}