<?php

namespace App\Http\Controllers;

use App\Models\MatierePremiere;
use App\Models\MatierePremiereHistorique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MatierePremiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $matieres = MatierePremiere::with('fournisseur', 'historiques', 'famille', 'type')->orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $matieres
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prix_achat' => 'required|numeric|min:0',
                'unite' => 'required|string',
                'fournisseur_id' => 'required|exists:fournisseurs,id',
                'famille_id' => 'nullable|exists:famille_matieres,id',
                'type_id' => 'nullable|exists:type_matieres,id',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            if ($request->hasFile('logoP')) {
                $path = $request->file('logoP')->store('public/matiere_premieres');
                $data['photo_url'] = \Storage::url($path);
            }

            $matiere = MatierePremiere::create($data);

            MatierePremiereHistorique::create([
                'matiere_premiere_id' => $matiere->id,
                'prix' => $matiere->prix_achat,
            ]);

            return response()->json([
                'message' => 'Matière première ajoutée avec succès',
                'data' => $matiere->load('fournisseur', 'historiques', 'famille', 'type')
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $matiere = MatierePremiere::with('fournisseur', 'historiques', 'famille', 'type')->findOrFail($id);
            return response()->json(['data' => $matiere], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $matiere = MatierePremiere::findOrFail($id);
            $oldPrice = $matiere->prix_achat;

            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prix_achat' => 'required|numeric|min:0',
                'unite' => 'required|string',
                'fournisseur_id' => 'required|exists:fournisseurs,id',
                'famille_id' => 'nullable|exists:famille_matieres,id',
                'type_id' => 'nullable|exists:type_matieres,id',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            if ($request->hasFile('logoP')) {
                if ($matiere->photo_url) {
                    $oldPath = str_replace('/storage', 'public', $matiere->photo_url);
                    \Storage::delete($oldPath);
                }
                $path = $request->file('logoP')->store('public/matiere_premieres');
                $data['photo_url'] = \Storage::url($path);
            }

            $matiere->update($data);

            if ($oldPrice != $matiere->prix_achat) {
                MatierePremiereHistorique::create([
                    'matiere_premiere_id' => $matiere->id,
                    'prix' => $matiere->prix_achat,
                ]);
            }

            return response()->json([
                'message' => 'Matière première modifiée avec succès',
                'data' => $matiere->load('fournisseur', 'historiques', 'famille', 'type')
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $matiere = MatierePremiere::findOrFail($id);
            $matiere->delete();

            return response()->json(['message' => 'Matière première supprimée avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
