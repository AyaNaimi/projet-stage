<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FournisseurController extends Controller
{
    public function index()
    {
        return response()->json(Fournisseur::all());
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'raison_sociale' => 'nullable|string|max:255',
                'nom' => 'nullable|string|max:255',
                'CodeFournisseur' => 'required|string|max:255|unique:fournisseurs,CodeFournisseur',
                'email' => 'nullable|email|max:255',
                'tele' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $userId = Auth::id() ?? \App\Models\User::first()?->id;

            if (!$userId) {
                return response()->json(['success' => false, 'message' => 'Aucun utilisateur trouvé pour l\'affectation.'], 401);
            }

            $fournisseur = Fournisseur::create([
                'raison_sociale' => $request->raison_sociale ?? $request->nom,
                'nom' => $request->nom,
                'CodeFournisseur' => $request->CodeFournisseur,
                'adresse' => $request->adresse ?? '-',
                'tele' => $request->tele ?? '-',
                'ville' => $request->ville ?? '-',
                'abreviation' => $request->abreviation ?? '-',
                'code_postal' => $request->code_postal ?? '-',
                'email' => $request->email ?? '-',
                'ice' => $request->ice ?? 0,
                'user_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Fournisseur ajouté avec succès',
                'data' => $fournisseur
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'ajout du fournisseur: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Fournisseur $fournisseur)
    {
        $fournisseur->update($request->all());
        return response()->json($fournisseur);
    }

    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();
        return response()->json(null, 204);
    }

    public function show(Fournisseur $fournisseur)
    {
        return response()->json($fournisseur);
    }
}
