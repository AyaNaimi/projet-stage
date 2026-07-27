<?php

namespace App\Http\Controllers;

use App\Models\Commune;
use Illuminate\Http\Request;

class CommuneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->getCommunes($request);
    }

    /**
     * Retrieve communes, optionally filtered by ville_id.
     */
    public function getCommunes(Request $request)
    {
        $ville_id = $request->query('ville_id');
        if ($ville_id) {
            $communes = Commune::where('ville_id', $ville_id)->orderBy('nom', 'asc')->get();
        } else {
            $communes = Commune::orderBy('nom', 'asc')->get();
        }
        return response()->json($communes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'ville_id' => 'required|exists:gp_villes,id',
        ]);

        $commune = Commune::create($request->all());
        return response()->json($commune, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $commune = Commune::find($id);
        if (!$commune) {
            return response()->json(['message' => 'Commune non trouvée'], 404);
        }
        return response()->json($commune);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $commune = Commune::find($id);
        if (!$commune) {
            return response()->json(['message' => 'Commune non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'ville_id' => 'nullable|exists:gp_villes,id',
        ]);

        $commune->update($request->all());
        return response()->json($commune);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $commune = Commune::find($id);
        if (!$commune) {
            return response()->json(['message' => 'Commune non trouvée'], 404);
        }

        $commune->delete();
        return response()->json(null, 204);
    }
}
