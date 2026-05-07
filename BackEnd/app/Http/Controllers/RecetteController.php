<?php

namespace App\Http\Controllers;

use App\Models\Recette;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecetteController extends Controller
{
    public function index($produitId)
    {
        try {
            $recettes = Recette::with('matierePremiere')->where('produit_id', $produitId)->get();
            return response()->json(['success' => true, 'data' => $recettes], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'produit_id' => 'required|exists:produits,id',
                'matiere_premiere_id' => 'required|exists:matiere_premieres,id',
                'quantite' => 'required|numeric|min:0',
                'perte' => 'nullable|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $recette = Recette::create($request->all());
            return response()->json(['message' => 'Ligne de recette ajoutée', 'data' => $recette->load('matierePremiere')], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $recette = Recette::findOrFail($id);
            $recette->update($request->all());
            return response()->json(['message' => 'Ligne de recette modifiée', 'data' => $recette->load('matierePremiere')], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $recette = Recette::findOrFail($id);
            $recette->delete();
            return response()->json(['message' => 'Ligne de recette supprimée'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function sync(Request $request, $produitId)
    {
        try {
            // Delete existing and replace or update
            // For simplicity, let's just replace
            Recette::where('produit_id', $produitId)->delete();
            
            $lines = $request->input('lines', []);
            foreach ($lines as $line) {
                Recette::create([
                    'produit_id' => $produitId,
                    'matiere_premiere_id' => $line['matiere_premiere_id'],
                    'quantite' => $line['quantite'],
                    'perte' => $line['perte'] ?? 0,
                ]);
            }

            return response()->json(['message' => 'Recette synchronisée avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
