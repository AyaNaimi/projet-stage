<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChargeIndirecte extends Model
{
    use HasFactory;

    protected $table = 'charges_indirectes';

    protected $guarded = [];
}
