<?php

namespace App\Http\Controllers;

use App\Models\Recette;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecetteController extends Controller
{
    public function index($produitId)
    {
        try {
            $recettes = Recette::with('matierePremiere')
                ->where('produit_id', $produitId)
                ->get()
                ->map(function ($recette) {
                    $nom = $recette->matiere_premiere_nom;
                    if (empty($nom)) {
                        $nom = $recette->matierePremiere->nom
                            ?? $recette->matierePremiere->designation
                            ?? $recette->matierePremiere->Code_produit
                            ?? null;
                    }

                    $recette->matiere_premiere_nom = $nom;
                    return $recette;
                });

            return response()->json(['success' => true, 'data' => $recettes], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            foreach (['nom', 'designation', 'titre', 'libelle'] as $field) {
                unset($data[$field]);
            }

            $validator = Validator::make($data, [
                'produit_id' => 'required|exists:produits,id',
                'matiere_premiere_id' => 'nullable|exists:matiere_premieres,id',
                'matiere_premiere_nom' => 'nullable|string|max:255',
                'quantite' => 'required|numeric|min:0',
                'perte' => 'nullable|numeric|min:0|max:100',
                'unite' => 'nullable|string|max:20',
                'quantite_reelle' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            if (empty($data['matiere_premiere_id'])) {
                return response()->json(['error' => 'Une matière première valide est requise'], 422);
            }

            $existing = Recette::where('produit_id', $data['produit_id'])
                ->where('matiere_premiere_id', $data['matiere_premiere_id'])
                ->first();

            if ($existing) {
                return response()->json(['error' => 'Cette matière première est déjà associée à ce produit'], 409);
            }

            $recette = Recette::create($data);
            return response()->json(['message' => 'Ligne de recette ajoutée', 'data' => $recette->load('matierePremiere')], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            foreach (['nom', 'designation', 'titre', 'libelle'] as $field) {
                unset($data[$field]);
            }

            $validator = Validator::make($data, [
                'produit_id' => 'nullable|exists:produits,id',
                'matiere_premiere_id' => 'nullable|exists:matiere_premieres,id',
                'matiere_premiere_nom' => 'nullable|string|max:255',
                'quantite' => 'nullable|numeric|min:0',
                'perte' => 'nullable|numeric|min:0|max:100',
                'unite' => 'nullable|string|max:20',
                'quantite_reelle' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $recette = Recette::findOrFail($id);
            $recette->update($data);
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
            Recette::where('produit_id', $produitId)->delete();

            $lines = $request->input('lines', []);
            foreach ($lines as $line) {
                Recette::create([
                    'produit_id' => $produitId,
                    'matiere_premiere_id' => $line['matiere_premiere_id'] ?? null,
                    'matiere_premiere_nom' => $line['matiere_premiere_nom'] ?? null,
                    'quantite' => $line['quantite'],
                    'perte' => $line['perte'] ?? 0,
                    'unite' => $line['unite'] ?? null,
                    'quantite_reelle' => $line['quantite_reelle'] ?? null,
                ]);
            }

            return response()->json(['message' => 'Recette synchronisée avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteSelected(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            if (empty($ids)) {
                return response()->json(['message' => 'Aucun ID fourni'], 400);
            }
            Recette::whereIn('id', $ids)->delete();
            return response()->json(['message' => 'Lignes de recette supprimées avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
