<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use Illuminate\Http\Request;

class VilleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pays_id = $request->query('pays_id');
        if ($pays_id) {
            $villes = Ville::where('pays_id', $pays_id)->orderBy('nom', 'asc')->get();
        } else {
            $villes = Ville::orderBy('nom', 'asc')->get();
        }
        return response()->json($villes);
    }

    /**
     * Retrieve villes, optionally filtered by pays_id (alias for index).
     */
    public function getVilles(Request $request)
    {
        return $this->index($request);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'pays_id' => 'required|exists:gp_pays,id',
        ]);

        $ville = Ville::create($request->all());
        return response()->json($ville, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville non trouvée'], 404);
        }
        return response()->json($ville);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'pays_id' => 'nullable|exists:gp_pays,id',
        ]);

        $ville->update($request->all());
        return response()->json($ville);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return response()->json(['message' => 'Ville non trouvée'], 404);
        }

        $ville->delete();
        return response()->json(null, 204);
    }
}
