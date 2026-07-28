<?php

namespace App\Http\Controllers;

use App\Models\Unite;
use Illuminate\Http\Request;

class UniteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $unites = Unite::orderBy('id', 'desc')->get();
        return response()->json($unites);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'service_id' => 'nullable|exists:services,id',
        ]);

        $unite = Unite::create($request->all());
        return response()->json($unite, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $unite = Unite::find($id);
        if (!$unite) {
            return response()->json(['message' => 'Unité non trouvée'], 404);
        }
        return response()->json($unite);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $unite = Unite::find($id);
        if (!$unite) {
            return response()->json(['message' => 'Unité non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'service_id' => 'nullable|exists:services,id',
        ]);

        $unite->update($request->all());
        return response()->json($unite);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unite = Unite::find($id);
        if (!$unite) {
            return response()->json(['message' => 'Unité non trouvée'], 404);
        }

        $unite->delete();
        return response()->json(null, 204);
    }
}
