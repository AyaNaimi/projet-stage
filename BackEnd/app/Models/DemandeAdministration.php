<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeAdministration extends Model
{
    use HasFactory;

    protected $table = 'demandes_administration';

    protected $fillable = [
        'employe',
        'type_demande',
        'date_demande',
        'statut',
        'commentaire',
    ];

    protected $casts = [
        'date_demande' => 'date:Y-m-d',
    ];
}
