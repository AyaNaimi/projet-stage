<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'service',
        'id_secteur',
        'photo',
    ];

    // Définissez la relation avec le modèle SecteurClient
    public function secteur()
    {
        return $this->belongsTo(SecteurClient::class, 'id_secteur');
    }
}
