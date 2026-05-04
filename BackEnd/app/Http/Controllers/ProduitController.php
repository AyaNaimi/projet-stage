<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\PrixProduit;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    public function index()
    {
        try {
            $produits = Produit::with(
                'categorie',
                'calibre',
                'user',
                'souscategorie',
                'prixProduits',
                'prixProduitsLast',
                'Embalge',
                'etiquette',
                'EmbalgeS',
                'stockProduit'
            )->orderBy('id', 'desc')->get();

            return response()->json([
                'message' => 'Liste des produits récupérée avec succès',
                'produit' => $produits,
                'count' => Produit::count(),
                'AllProduit' => Produit::all(),
                'Categorie' => Categorie::with('produits')->get(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        if (!Gate::allows('create_product')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un produit.');
        }

        Log::info('debut de store');
        Log::info('request reçu dans store', $request->all());

        try {
            $validator = Validator::make($request->all(), [
                'Code_produit' => 'required|unique:produits,Code_produit',
                'designation' => 'required',
                'calibre_id' => 'nullable',
                'type_quantite' => 'required',
                'unite' => 'nullable',
                'seuil_alerte' => 'nullable',
                'stock_initial' => 'nullable',
                'etat_produit' => 'nullable',
                'marque' => 'nullable',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'categorie_id' => 'required',
                'suCat_id' => 'nullable',
                'genre' => 'nullable',
                'type' => 'nullable',
                'Dvie' => 'nullable',
                'reference' => 'nullable',
                'prix_vente' => 'nullable|numeric|min:0',
                'tva' => 'nullable|numeric|min:0',
                'prixProduits' => 'nullable|array',
                'prixProduits.*.id' => 'nullable|integer',
                'prixProduits.*.dateDebut' => 'nullable|date',
                'prixProduits.*.dateFin' => 'nullable|date',
                'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                'prixProduits.*.typeQte' => 'nullable|string|max:10',
                'prixProduits.*.Unite' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $produit = new Produit();
            $produit->Code_produit = $request->input('Code_produit');
            $produit->designation = $request->input('designation');
            $produit->calibre_id = $request->input('calibre_id');
            $produit->type_quantite = $request->input('type_quantite');
            $produit->unite = $request->input('unite');
            $produit->seuil_alerte = $request->input('seuil_alerte');
            $produit->stock_initial = $request->input('stock_initial');
            $produit->etat_produit = $request->input('etat_produit');
            $produit->marque = $request->input('marque');
            $produit->categorie_id = $request->input('categorie_id');
            $produit->prix_vente = $request->input('prix_vente');
            $produit->suCat_id = $request->input('suCat_id');
            $produit->genre = $request->input('genre');
            $produit->tva = $request->input('tva');
            $produit->type = $request->input('type');
            $produit->Dvie = $request->input('Dvie');
            $produit->reference = $request->input('reference');
            $produit->produit_Etiq_id = $request->input('produit_Etiq_id');
            $produit->produit_Embalg_id = $request->input('produit_Embalg_id');
            $produit->produit_Embalg_S_id = $request->input('produit_Embalg_S_id');
            $produit->user_id = Auth::id();

            if ($request->hasFile('logoP')) {
                $photoPath = $request->file('logoP')->store('public/logop');
                $produit->logoP = Storage::url($photoPath);
            }

            $produit->save();

            $prixProduits = $request->input('prixProduits');
            if (is_array($prixProduits)) {
                foreach ($prixProduits as $prix) {
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

            return response()->json([
                'message' => 'Produit ajouté avec succès',
                'produit' => $produit,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateLogo(Request $request, $id)
    {
        try {
            $request->validate([
                'logoP' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $produit = Produit::findOrFail($id);

            if ($request->hasFile('logoP')) {
                if ($produit->logoP) {
                    $oldFilePath = str_replace('/storage', 'public', $produit->logoP);
                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                    }
                }

                $photoPath = $request->file('logoP')->store('public/logop');
                $produit->logoP = Storage::url($photoPath);
            }

            $produit->save();

            return response()->json([
                'message' => 'Logo updated successfully!',
                'logoP' => $produit->logoP,
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'error' => 'Failed to update logo',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $produit = Produit::with('calibre', 'categorie')->findOrFail($id);
            return response()->json(['produit' => $produit]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if (!Gate::allows('edit_product')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce produit.');
        }

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
                'suCat_id' => 'nullable',
                'genre' => 'nullable',
                'Dvie' => 'nullable',
                'prix_vente' => 'nullable|numeric|min:0',
                'tva' => 'nullable|numeric|min:0',
                'prixProduits' => 'nullable|array',
                'prixProduits.*.id' => 'nullable|integer',
                'prixProduits.*.dateDebut' => 'nullable|date',
                'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                'prixProduits.*.typeQte' => 'nullable|string|max:10',
                'prixProduits.*.Unite' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $request['user_id'] = Auth::id();
            $produit = Produit::findOrFail($id);
            $data = $request->except('prixProduits');
            $produit->update($data);

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

            return response()->json([
                'message' => 'Produit modifié avec succès',
                'produit' => $produit,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        if (!Gate::allows('delete_product')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer ce produit.');
        }

        try {
            $produit = Produit::findOrFail($id);
            $produit->delete();

            return response()->json(['message' => 'Produit supprimé avec succès'], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] === 1451) {
                return response()->json([
                    'error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.',
                ], 400);
            }

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteSelected(Request $request)
    {
        $ids = $request->input('ids'); // Récupère les IDs sélectionnés

        if (!empty($ids) && is_array($ids)) {
            $deleted = 0;
            $errors = [];

            foreach ($ids as $id) {
                try {
                    $produit = Produit::findOrFail($id);
                    $produit->delete();
                    $deleted++;
                } catch (\Illuminate\Database\QueryException $e) {
                    $errors[] = [
                        'id' => $id,
                        'error' => $e->errorInfo[1] === 1451
                            ? 'Impossible de supprimer (utilisé ailleurs).'
                            : $e->getMessage()
                    ];
                }
            }

            return response()->json([
                'message' => "$deleted élément(s) supprimé(s) avec succès.",
                'errors' => $errors
            ], 200);
        }

        return response()->json(['message' => 'Aucun élément sélectionné'], 400);
    }

    public function destroyPrix($id)
    {
        try {
            $produit = PrixProduit::findOrFail($id);
            $produit->delete();

            return response()->json(['message' => 'Produit supprimé avec succès'], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] === 1451) {
                return response()->json([
                    'error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.',
                ], 400);
            }

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function chartProduitData()
    {
        try {
            $categories = Categorie::with('produits')->get();
            $allProduits = Produit::all();

            return response()->json([
                'message' => 'Données du graphique récupérées avec succès',
                'Categorie' => $categories,
                'AllProduit' => $allProduits,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function produitsAvecStock()
    {
        try {
            $produits = Produit::whereHas('stockProduit')
                ->with(['categorie', 'calibre', 'user', 'souscategorie', 'stockProduit'])
                ->get()
                ->map(function ($produit) {
                    $stock = $produit->stockProduit->first();
                    $quantite = ($stock->qte_kg_litre > 0) ? $stock->qte_kg_litre : $stock->qte_unite;

                    return array_merge($produit->toArray(), [
                        'stock' => $quantite,
                    ]);
                });

            return response()->json([
                'message' => 'Liste des produits avec stock récupérée avec succès',
                'produits' => $produits,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->query('q', '');

            if (empty($query)) {
                return response()->json([
                    'success' => false,
                    'data' => null,
                    'message' => 'Le paramètre de recherche est requis'
                ], 400);
            }

            $produits = Produit::where(function ($q) use ($query) {
                    $q->where('designation', 'like', "%{$query}%")
                      ->orWhere('reference', 'like', "%{$query}%")
                      ->orWhere('Code_produit', 'like', "%{$query}%");
                })
                ->with('categorie', 'calibre')
                ->orderBy('designation', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $produits,
                'message' => 'Résultats de recherche'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function byCategorie($categorieId)
    {
        try {
            $produits = Produit::where('categorie_id', $categorieId)
                ->with('categorie', 'calibre')
                ->orderBy('designation', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $produits,
                'message' => 'Produits par catégorie'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
