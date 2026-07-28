<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecteurClient extends Model
{
    use HasFactory;
    protected $guarded=[]; 

    public function client()
{
    return $this->hasMany(Client::class ,'secteur_id');
}
public function Fournisseur()
{
    return $this->hasMany(Fournisseur::class ,'secteur_id');
}
}