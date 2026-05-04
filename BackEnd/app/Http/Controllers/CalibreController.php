<?php

namespace App\Http\Controllers;

use App\Models\Calibre;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class CalibreController extends Controller
{
    public function index()
    {
        try {
            $calibres = Calibre::orderBy('id', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $calibres,
                'message' => 'Liste des calibres'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'calibre' => 'required|string|max:255',
            ]);

            $calibre = Calibre::create($validated);

            return response()->json([
                'success' => true,
                'data' => $calibre,
                'message' => 'Calibre créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $calibre = Calibre::with('produits')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $calibre,
                'message' => 'Calibre récupéré avec succès'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Calibre non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'calibre' => 'required|string|max:255',
            ]);

            $calibre = Calibre::findOrFail($id);
            $calibre->update($validated);

            return response()->json([
                'success' => true,
                'data' => $calibre,
                'message' => 'Calibre mis à jour avec succès'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $calibre = Calibre::findOrFail($id);

            if ($calibre->produits()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'data' => null,
                    'message' => 'Impossible de supprimer ce calibre car il est utilisé par des produits'
                ], 400);
            }

            $calibre->delete();

            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Calibre supprimé avec succès'
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Impossible de supprimer ce calibre car il est déjà utilisé'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
