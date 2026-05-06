<?php

namespace App\Http\Controllers;

use App\Models\TypeMatiere;
use Illuminate\Http\Request;

class TypeMatiereController extends Controller
{
    public function index()
    {
        return response()->json(TypeMatiere::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'image_url' => 'nullable|string',
        ]);

        $type = TypeMatiere::create($validated);
        return response()->json($type, 201);
    }
}
