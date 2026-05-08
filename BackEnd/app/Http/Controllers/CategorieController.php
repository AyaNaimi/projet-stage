<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategorieController extends Controller
{
    public function index()
    {
        $categories = Categorie::orderBy('id', 'desc')->get();
        return response()->json($categories);
    }

    public function show($id)
    {
        $categorie = Categorie::find($id);
        return response()->json($categorie);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'categorie' => 'required',
                'idCatMer' => 'nullable',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,avif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $category = new Categorie();
            $category->categorie = $request->input('categorie');
            $category->idCatMer = $request->input('idCatMer');

            if ($request->hasFile('logoP')) {
                $logoPath = $request->file('logoP')->store('public/logoP');
                $category->logoP = Storage::url($logoPath);
            } else {
                $category->logoP = '';
            }

            $category->save();

            return response()->json([
                'message' => 'Categorie ajoutee avec succes',
                'category' => $category,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => [$e->getMessage()]]], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);

        try {
            $validator = Validator::make($request->all(), [
                'categorie' => 'required|string',
                'idCatMer' => 'nullable',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,avif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $categorie->categorie = $request->input('categorie');
            $categorie->idCatMer = $request->input('idCatMer');

            if ($request->hasFile('logoP')) {
                if ($categorie->logoP) {
                    $oldLogoPath = str_replace('/storage/', 'public/', $categorie->logoP);
                    Storage::delete($oldLogoPath);
                }

                $logoPath = $request->file('logoP')->store('public/logoP');
                $categorie->logoP = Storage::url($logoPath);
            }

            $categorie->save();

            return response()->json([
                'message' => 'Categorie modifiee avec succes',
                'category' => $categorie,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(null, 204);
        }

        $categorie->delete();
        return response()->json(null, 204);
    }
}
