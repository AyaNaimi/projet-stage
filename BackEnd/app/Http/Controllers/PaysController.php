<?php

namespace App\Http\Controllers;

use App\Models\Pays;
use Illuminate\Http\Request;

class PaysController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pays = Pays::orderBy('nom', 'asc')->get();
        return response()->json($pays);
    }

    /**
     * Return all pays with nested villes and communes.
     */
    public function getFullData()
    {
        $pays = Pays::with('villes.communes')->orderBy('nom', 'asc')->get();
        return response()->json($pays);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'code_pays' => 'nullable|string|max:10',
        ]);

        $pays = Pays::create($request->all());
        return response()->json($pays, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pays = Pays::find($id);
        if (!$pays) {
            return response()->json(['message' => 'Pays non trouvé'], 404);
        }
        return response()->json($pays);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pays = Pays::find($id);
        if (!$pays) {
            return response()->json(['message' => 'Pays non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'code_pays' => 'nullable|string|max:10',
        ]);

        $pays->update($request->all());
        return response()->json($pays);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pays = Pays::find($id);
        if (!$pays) {
            return response()->json(['message' => 'Pays non trouvé'], 404);
        }

        $pays->delete();
        return response()->json(null, 204);
    }
}
