<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilleMatiere extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function matieres()
    {
        return $this->hasMany(MatierePremiere::class, 'famille_id');
    }
}
