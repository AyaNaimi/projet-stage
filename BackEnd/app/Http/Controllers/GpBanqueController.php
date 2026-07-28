<?php

namespace App\Http\Controllers;

use App\Models\GpBanque;
use Illuminate\Http\Request;

class GpBanqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banques = GpBanque::orderBy('nom', 'asc')->get();
        return response()->json($banques);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $banque = GpBanque::create($request->all());
        return response()->json($banque, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banque = GpBanque::find($id);
        if (!$banque) {
            return response()->json(['message' => 'Banque non trouvée'], 404);
        }
        return response()->json($banque);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banque = GpBanque::find($id);
        if (!$banque) {
            return response()->json(['message' => 'Banque non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $banque->update($request->all());
        return response()->json($banque);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banque = GpBanque::find($id);
        if (!$banque) {
            return response()->json(['message' => 'Banque non trouvée'], 404);
        }

        $banque->delete();
        return response()->json(null, 204);
    }
}
