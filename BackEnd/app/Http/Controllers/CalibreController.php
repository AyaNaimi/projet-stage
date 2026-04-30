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

            return response()->json($calibres, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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
                'message' => 'Calibre ajouté avec succès',
                'calibre' => $calibre,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $calibre = Calibre::findOrFail($id);

            return response()->json($calibre, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
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
                'message' => 'Calibre modifié avec succès',
                'calibre' => $calibre,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $calibre = Calibre::findOrFail($id);
            $calibre->delete();

            return response()->json(['message' => 'Calibre supprimé avec succès'], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Impossible de supprimer ce calibre car il est déjà utilisé.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
