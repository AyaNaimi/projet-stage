<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Affectation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'equipement_id',
        'date_attribution',
        'date_restitution',
        'etat',
        'commentaire',
    ];

    protected $casts = [
        'date_attribution' => 'date:Y-m-d',
        'date_restitution' => 'date:Y-m-d',
    ];

    public function employe(): BelongsTo
    {
        return $this->belongsTo(Employe::class);
    }

    public function equipement(): BelongsTo
    {
        return $this->belongsTo(Equipement::class);
    }
}
