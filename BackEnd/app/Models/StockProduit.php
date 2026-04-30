<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockProduit extends Model
{
    use HasFactory;
    protected $table = 'stock__productions';
    protected $guarded = [];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
