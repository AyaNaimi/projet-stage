<?php

namespace App\Http\Controllers;

use App\Models\FamilleMatiere;
use Illuminate\Http\Request;

class FamilleMatiereController extends Controller
{
    public function index()
    {
        return response()->json(FamilleMatiere::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'image_url' => 'nullable|string',
        ]);

        $famille = FamilleMatiere::create($validated);
        return response()->json($famille, 201);
    }
}
