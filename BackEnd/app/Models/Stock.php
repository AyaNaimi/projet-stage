<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;
    protected $table = 'stock';
    // Define the table name (optional, if different from 'stocks')

    // Allow mass assignment for these fields
    protected $fillable = [
        'Unite',
        'ClassPoid','dateArivage',
        'quantite'
    ];
    public function ligneBonEntreUnite()
    {
        return $this->hasMany(ligneBonEntreUnite::class, 'Unite_id');
    }
    public function ligneBonSortieUnite()
    {
        return $this->hasMany(ligne_bon_sortie_unites::class, 'Unite_id');
    }
    public function stockligne()
    {
        return $this->hasMany(StockLinge::class, 'Unite_id');
    }
}