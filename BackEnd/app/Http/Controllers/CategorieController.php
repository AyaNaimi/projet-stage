<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategorieController extends Controller
{
    public function index()
    {
        try {
            $categories = Categorie::orderBy('id', 'desc')->get();
            return response()->json($categories, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'categorie' => 'required|string|max:255',
                'logoP'     => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'parent_id' => 'nullable|exists:categories,id',
            ]);

            $data = [
                'categorie' => $validated['categorie'],
                'logoP'     => '',
                'parent_id' => $request->input('parent_id'),
            ];

            if ($request->hasFile('logoP')) {
                $path = $request->file('logoP')->store('public/categories');
                $data['logoP'] = Storage::url($path);
            }

            $categorie = Categorie::create($data);

            return response()->json([
                'message'   => 'Categorie ajoutée avec succès',
                'categorie' => $categorie,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $categorie = Categorie::findOrFail($id);
            return response()->json($categorie, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $categorie = Categorie::findOrFail($id);

            $validated = $request->validate([
                'categorie' => 'required|string|max:255',
                'logoP'     => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'parent_id' => 'nullable|exists:categories,id',
            ]);

            $categorie->categorie = $validated['categorie'];
            $categorie->parent_id = $request->input('parent_id');

            if ($request->hasFile('logoP')) {
                if ($categorie->logoP) {
                    $oldFilePath = str_replace('/storage/', 'public/', $categorie->logoP);
                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                    }
                }
                $path = $request->file('logoP')->store('public/categories');
                $categorie->logoP = Storage::url($path);
            }

            $categorie->save();

            return response()->json([
                'message'   => 'Categorie modifiée avec succès',
                'categorie' => $categorie,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $categorie = Categorie::findOrFail($id);

            if ($categorie->logoP) {
                $filePath = str_replace('/storage/', 'public/', $categorie->logoP);
                if (Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }

            $categorie->delete();

            return response()->json(['message' => 'Categorie supprimée avec succès'], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Impossible de supprimer cette catégorie car elle est déjà utilisée.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}