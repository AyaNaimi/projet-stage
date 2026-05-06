<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatierePremiereHistorique extends Model
{
    use HasFactory;

    protected $fillable = [
        'matiere_premiere_id',
        'prix',
    ];

    public function matierePremiere()
    {
        return $this->belongsTo(MatierePremiere::class);
    }
}
