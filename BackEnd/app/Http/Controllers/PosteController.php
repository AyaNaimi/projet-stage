<?php

namespace App\Http\Controllers;

use App\Models\Poste;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $postes = Poste::orderBy('id', 'desc')->get();
        return response()->json($postes);
    }

    /**
     * Retrieve postes by unite ID.
     */
    public function getPostesByUnite(string $uniteId)
    {
        $postes = Poste::where('unite_id', $uniteId)->orderBy('id', 'desc')->get();
        return response()->json($postes);
    }

    /**
     * Retrieve hierarchy for a poste.
     */
    public function getHierarchy(string $id)
    {
        $poste = Poste::with('unite.service')->find($id);
        if (!$poste) {
            return response()->json(['message' => 'Poste non trouvé'], 404);
        }
        return response()->json($poste);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'unite_id' => 'nullable|exists:gp_unites,id',
        ]);

        $poste = Poste::create($request->all());
        return response()->json($poste, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $poste = Poste::find($id);
        if (!$poste) {
            return response()->json(['message' => 'Poste non trouvé'], 404);
        }
        return response()->json($poste);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $poste = Poste::find($id);
        if (!$poste) {
            return response()->json(['message' => 'Poste non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'unite_id' => 'nullable|exists:gp_unites,id',
        ]);

        $poste->update($request->all());
        return response()->json($poste);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $poste = Poste::find($id);
        if (!$poste) {
            return response()->json(['message' => 'Poste non trouvé'], 404);
        }

        $poste->delete();
        return response()->json(null, 204);
    }
}
