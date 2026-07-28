<?php

namespace App\Http\Controllers;

use App\Models\GpCategorieEmploye;
use Illuminate\Http\Request;

class GpCategorieEmployeController extends Controller
{
    public function index()
    {
        $categories = GpCategorieEmploye::orderBy('nom')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:gp_categories_employes,nom',
            'description' => 'nullable|string',
        ]);

        $categorie = GpCategorieEmploye::create($request->only('nom', 'description'));
        return response()->json($categorie, 201);
    }

    public function show($id)
    {
        $categorie = GpCategorieEmploye::find($id);
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        return response()->json($categorie);
    }

    public function update(Request $request, $id)
    {
        $categorie = GpCategorieEmploye::find($id);
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255|unique:gp_categories_employes,nom,' . $id,
            'description' => 'nullable|string',
        ]);

        $categorie->update($request->only('nom', 'description'));
        return response()->json($categorie);
    }

    public function destroy($id)
    {
        $categorie = GpCategorieEmploye::find($id);
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $categorie->delete();
        return response()->json(null, 204);
    }
}