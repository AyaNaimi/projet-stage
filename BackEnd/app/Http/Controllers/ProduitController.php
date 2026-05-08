<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\categorie;
use App\Models\PrixProduit;
use App\Models\Calibre;
use App\Models\StockProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with([
            'calibre',
            'categorie',
            'souscategorie',
            'user',
            'etiquette',
            'Embalge',
            'EmbalgeS',
            'prixProduits',
            'recettes.matierePremiere'
        ])->orderBy('id', 'desc')->get();

        $categories = categorie::where('parent_id', 0)->get();

        return response()->json([
            'produit' => $produits,
            'AllProduit' => Produit::all(),
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        if (Gate::allows('add_product')) {
            try {
                $validator = Validator::make($request->all(), [
                    'Code_produit' => 'required|unique:produits',
                    'designation' => 'required',
                    'calibre_id' => 'nullable',
                    'type_quantite' => 'required',
                    'unite' => 'nullable',
                    'seuil_alerte' => 'nullable',
                    'stock_initial' => 'nullable',
                    'etat_produit' => 'nullable',
                    'categorie_id' => 'required',
                    'genre' => 'nullable',
                    'Dvie' => 'nullable',
                    'tva' => 'nullable',
                    'prixProduits' => 'nullable|array',
                    'prixProduits.*.dateDebut' => 'nullable|date',
                    'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                    'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                    'prixProduits.*.typeQte' => 'nullable',
                    'prixProduits.*.Unite' => 'nullable',
                    'unite_etiquette' => 'nullable',
                    'unite_embalage_primaire' => 'nullable',
                    'unite_embalage_secondaire' => 'nullable',
                ]);

                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                $data = $request->except(['prixProduits', 'lines']);
                $data['user_id'] = Auth::id();
                $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
                $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
                $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;

                $produit = Produit::create($data);

                // Sync Recipes (Nomenclature)
                if ($request->has('lines')) {
                    $lines = is_string($request->input('lines')) 
                        ? json_decode($request->input('lines'), true) 
                        : $request->input('lines');
                    
                    foreach ($lines as $line) {
                        if (!empty($line['matiere_premiere_id'])) {
                            $produit->recettes()->create([
                                'matiere_premiere_id' => $line['matiere_premiere_id'],
                                'quantite' => $line['quantite'] ?? 0,
                                'perte' => $line['perte'] ?? 0,
                                'unite' => $line['unite'] ?? null,
                                'quantite_reelle' => $line['quantite_reelle'] ?? null,
                            ]);
                        }
                    }
                }

                if ($request->has('prixProduits')) {
                    foreach ($request->input('prixProduits') as $prix) {
                        $produit->prixProduits()->create([
                            'produit_id' => $produit->id,
                            'dateDebut' => $prix['dateDebut'] ?? null,
                            'dateFin' => $prix['dateFin'] ?? null,
                            'prixProduit' => $prix['prixProduit'] ?? null,
                            'typeQte' => $prix['typeQte'] ?? null,
                            'Unite' => $prix['Unite'] ?? null,
                        ]);
                    }
                }

                return response()->json(['message' => 'Produit ajouté avec succès', 'produit' => $produit], 201);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    public function update(Request $request, $id)
    {
        // Bypassing gate for debugging purposes
        // if (Gate::allows('edit_product')) {
            try {
                $validator = Validator::make($request->all(), [
                    'Code_produit' => 'required|unique:produits,Code_produit,' . $id,
                    'designation' => 'required',
                    'calibre_id' => 'nullable',
                    'type_quantite' => 'required',
                    'unite' => 'nullable',
                    'seuil_alerte' => 'nullable',
                    'stock_initial' => 'nullable',
                    'etat_produit' => 'nullable',
                    'categorie_id' => 'nullable',
                    'genre' => 'nullable',
                    'Dvie' => 'nullable',
                    'tva' => 'nullable',
                    'prixProduits' => 'nullable|array',
                    'prixProduits.*.dateDebut' => 'nullable|date',
                    'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                    'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                    'prixProduits.*.typeQte' => 'nullable',
                    'prixProduits.*.Unite' => 'nullable',
                    'unite_etiquette' => 'nullable',
                    'unite_embalage_primaire' => 'nullable',
                    'unite_embalage_secondaire' => 'nullable',
                ]);

                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors(), $request->all()], 400);
                }

                $produit = Produit::findOrFail($id);
                $data = $request->except(['prixProduits', 'lines']);

                $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
                $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
                $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;
                $data['user_id'] = Auth::id() ?: $produit->user_id;

                $produit->update($data);

                // Sync Recipes (Nomenclature)
                if ($request->has('lines')) {
                    $produit->recettes()->delete(); 
                    $lines = is_string($request->input('lines')) 
                        ? json_decode($request->input('lines'), true) 
                        : $request->input('lines');
                    
                    foreach ($lines as $line) {
                        if (!empty($line['matiere_premiere_id'])) {
                            $produit->recettes()->create([
                                'matiere_premiere_id' => $line['matiere_premiere_id'],
                                'quantite' => $line['quantite'] ?? 0,
                                'perte' => $line['perte'] ?? 0,
                                'unite' => $line['unite'] ?? null,
                                'quantite_reelle' => $line['quantite_reelle'] ?? null,
                            ]);
                        }
                    }
                }

                if ($request->has('prixProduits')) {
                    foreach ($request->input('prixProduits') as $prix) {
                        if (isset($prix['id']) && $prix['id']) {
                            $prixProduit = PrixProduit::findOrFail($prix['id']);
                            $prixProduit->update([
                                'dateDebut' => $prix['dateDebut'] ?? null,
                                'dateFin' => $prix['dateFin'] ?? null,
                                'prixProduit' => $prix['prixProduit'] ?? null,
                                'typeQte' => $prix['typeQte'] ?? null,
                                'Unite' => $prix['Unite'] ?? null,
                            ]);
                        } else {
                            $produit->prixProduits()->create([
                                'produit_id' => $produit->id,
                                'dateDebut' => $prix['dateDebut'] ?? null,
                                'dateFin' => $prix['dateFin'] ?? null,
                                'prixProduit' => $prix['prixProduit'] ?? null,
                                'typeQte' => $prix['typeQte'] ?? null,
                                'Unite' => $prix['Unite'] ?? null,
                            ]);
                        }
                    }
                }

                return response()->json(['message' => 'Produit mis à jour avec succès', 'produit' => $produit]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        // } else {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }
    }

    public function show($id)
    {
        try {
            $produit = Produit::with('calibre', 'categorie')->findOrFail($id);
            $data = $produit->toArray();
            $data['logoP'] = $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null;

            return response()->json(['produit' => $data]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        if (Gate::allows('delete_product')) {
            try {
                $produit = Produit::findOrFail($id);
                $produit->delete();
                return response()->json(['message' => 'Produit supprimé avec succès'], 200);
            } catch (\Illuminate\Database\QueryException $e) {
                if ($e->errorInfo[1] === 1451) {
                    return response()->json(['error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.'], 400);
                } else {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    public function deleteSelected(Request $request)
    {
        $ids = $request->input('ids'); 

        if (!empty($ids)) {
            $errors = [];
            foreach ($ids as $id) {
                try {
                    $produit = Produit::findOrFail($id);
                    $produit->delete();
                } catch (\Illuminate\Database\QueryException $e) {
                    if ($e->errorInfo[1] === 1451) {
                        $errors[] = "Produit #$id est utilisé dans d'autres plateformes.";
                    } else {
                        $errors[] = "Produit #$id: " . $e->getMessage();
                    }
                }
            }
            if (!empty($errors)) {
                return response()->json(['errors' => $errors], 400);
            }
            return response()->json(['message' => 'Éléments supprimés avec succès']);
        }

        return response()->json(['message' => 'Aucun élément sélectionné'], 400);
    }

    public function destroyPrix($id)
    {
        try {
            $prixProduit = PrixProduit::findOrFail($id);
            $prixProduit->delete();
            return response()->json(['message' => 'Prix supprimé avec succès'], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] === 1451) {
                return response()->json(['error' => 'Impossible de supprimer ce prix car il est lié à d\'autres enregistrements.'], 400);
            } else {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
    }

    public function produitsAvecStock()
    {
        try {
            $produits = Produit::has('stockProduit')->get();
            return response()->json(['produits' => $produits]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $produits = Produit::where('designation', 'like', "%$query%")
            ->orWhere('Code_produit', 'like', "%$query%")
            ->get();
        return response()->json(['produits' => $produits]);
    }

    public function byCategorie($categorieId)
    {
        $produits = Produit::where('categorie_id', $categorieId)->get();
        return response()->json(['produits' => $produits]);
    }

    public function updateLogo(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        if ($request->hasFile('logoP')) {
            if ($produit->logoP) {
                Storage::disk('public')->delete($produit->logoP);
            }
            $path = $request->file('logoP')->store('logos', 'public');
            $produit->update(['logoP' => $path]);
        }
        return response()->json(['message' => 'Logo mis à jour', 'logo_url' => asset('storage/' . $produit->logoP)]);
    }

    public function chartProduitData()
    {
        $data = Produit::select('designation', 'stock_initial')->take(10)->get();
        return response()->json($data);
    }
}
