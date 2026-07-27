<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpCategorieEmploye extends Model
{
    use HasFactory;

    protected $table = 'gp_categories_employes';

    protected $fillable = [
        'nom',
        'description',
    ];

    public function employes()
    {
        return $this->hasMany(Employe::class, 'categorie', 'nom');
    }
}