<?php

namespace App\Http\Controllers\Actifs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DemandeMaterielController extends Controller
{
    public function index()
    {
        return response()->json(['data' => []]);
    }
}
