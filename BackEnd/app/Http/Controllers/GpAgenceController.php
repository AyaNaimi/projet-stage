<?php

namespace App\Http\Controllers;

use App\Models\GpAgence;
use Illuminate\Http\Request;

class GpAgenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agences = GpAgence::orderBy('nom', 'asc')->get();
        return response()->json($agences);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'banque_id' => 'required|exists:gp_banques,id',
        ]);

        $agence = GpAgence::create($request->all());
        return response()->json($agence, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $agence = GpAgence::find($id);
        if (!$agence) {
            return response()->json(['message' => 'Agence non trouvée'], 404);
        }
        return response()->json($agence);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $agence = GpAgence::find($id);
        if (!$agence) {
            return response()->json(['message' => 'Agence non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'banque_id' => 'nullable|exists:gp_banques,id',
        ]);

        $agence->update($request->all());
        return response()->json($agence);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $agence = GpAgence::find($id);
        if (!$agence) {
            return response()->json(['message' => 'Agence non trouvée'], 404);
        }

        $agence->delete();
        return response()->json(null, 204);
    }
}
