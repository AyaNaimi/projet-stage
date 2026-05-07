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
        // Check if the user has permission to create a category

            try {
                // Validate the incoming request
                $validator = Validator::make($request->all(), [
                    'categorie' => 'required',
                    'idCatMer' => 'nullable',

                    // Logo is optional (especially for sous-catégorie); validate only if provided
                    'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
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
                    $logoPath = $request->file('logoP')->store('public/logoP'); // Store logo in public/logoc directory
                    $category->logoP = Storage::url($logoPath); // Save the public path to the logo
                } else {
                    // `categories.logoP` is non-nullable in DB; keep it as empty string when no logo is provided.
                    $category->logoP = '';
                }
    
                // Save the category to the database
                $category->save();
    
                // Return success response
                return response()->json(['message' => 'Catégorie ajoutée avec succès', 'category' => $category], 200);
    
            } catch (\Exception $e) {
                // Handle any errors and return a JSON response
                return response()->json(['error' => $e->getMessage()], 500);
            }
       
    }

    public function update(Request $request, $id)
    {
        // Find the category by ID or fail if not found
        $categorie = Categorie::findOrFail($id);
    
        try {
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'categorie' => 'required|string', // Ensure category name is required
                'idCatMer' => 'nullable',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            ]);
    
            // If validation fails, return error response
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }
    
            // Update the category name
            $categorie->categorie = $request->input('categorie');
    
            // Handle logo image upload if a new logo is provided
            if ($request->hasFile('logoP')) {
                // Delete the old logo if it exists
                if ($categorie->logoP) {
                    $oldLogoPath = str_replace('/storage/', 'public/', $categorie->logoP);
                    Storage::delete($oldLogoPath); // Delete the old logo file
                }
    
                // Store the new logo
                $logoPath = $request->file('logoP')->store('public/logoP'); // Store logo in public/logoP directory
                $categorie->logoP = Storage::url($logoPath); // Save the public path to the new logo
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
