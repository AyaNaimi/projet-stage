<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'categorie' => 'required',
                'idCatMer' => 'nullable',
                'logoP' => 'nullable', 
            ]);

            // If validation fails, return error response
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            // Create a new Category instance
            $category = new Categorie();
            $category->categorie = $request->input('categorie');
            $category->idCatMer = $request->input('idCatMer');

            // Handle logo image upload
            if ($request->hasFile('logoP')) {
                $logoPath = $request->file('logoP')->store('public/logoP');
                $category->logoP = Storage::url($logoPath);
            } else {
                $category->logoP = ''; // Default empty if no image provided
            }

            // Save the category to the database
            $category->save();

            // Return success response
            return response()->json(['message' => 'Catégorie ajoutée avec succès', 'category' => $category], 200);

        } catch (\Exception $e) {
            // Handle any errors and return a JSON response
            return response()->json(['error' => ['message' => [$e->getMessage()]]], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Find the category by ID or fail if not found
        $categorie = Categorie::findOrFail($id);
    
        try {
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'categorie' => 'required|string',
                'idCatMer' => 'nullable',
                'logoP' => 'nullable',
            ]);
    
            // If validation fails, return error response
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }
    
            // Update the category name
            $categorie->categorie = $request->input('categorie');
            $categorie->idCatMer = $request->input('idCatMer');
    
            // Handle logo image upload if a new logo is provided
            if ($request->hasFile('logoP')) {
                // Delete the old logo if it exists
                if ($categorie->logoP) {
                    $oldLogoPath = str_replace('/storage/', 'public/', $categorie->logoP);
                    Storage::delete($oldLogoPath);
                }
    
                // Store the new logo
                $logoPath = $request->file('logoP')->store('public/logoP');
                $categorie->logoP = Storage::url($logoPath);
            }
    
            // Save the updated category to the database
            $categorie->save();
    
            // Return success response
            return response()->json(['message' => 'Catégorie modifiée avec succès', 'category' => $categorie], 200);
    
        } catch (\Exception $e) {
            // Handle any errors and return a JSON response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    

    public function destroy($id)
    {
        Categorie::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
