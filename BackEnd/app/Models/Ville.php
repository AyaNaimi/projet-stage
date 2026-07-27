<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    use HasFactory;

    protected $table = 'gp_villes';

    protected $fillable = [
        'nom', 'pays_id',
    ];

    public function pays()
    {
        return $this->belongsTo(Pays::class, 'pays_id');
    }

    public function communes()
    {
        return $this->hasMany(Commune::class, 'ville_id');
    }
}
