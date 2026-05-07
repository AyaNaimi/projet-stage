<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrixProduit extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'prix_produits';

    /**
     * Les attributs pouvant être assignés en masse.
     *
     * @var array
     */
    protected $fillable = [
        'id_produit',
        'dateDebut',
        'dateFin',
        'prixProduit',
        'Unite',
        'typeQte'
    ];

    /**
     * Définir la relation avec le modèle Produit.
     * (Supposons qu'il existe un modèle Produit).
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id'); // Précisez 'id_produit' comme clé étrangère
    }
}
