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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProduitController extends Controller
{
    public function index()
    {
        try {
            $produits = Produit::with([
                'categorie',
                'calibre',
                'user',
                'souscategorie',
                'prixProduits',
                'prixProduitsLast',
                'Embalge',
                'etiquette',
                'EmbalgeS',
                'stockProduit',
                'recettes.matierePremiere'
            ])->orderBy('id', 'desc')->get()
                ->map(function ($produit) {
                    $data = $produit->toArray();
                    $data['logoP'] = $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null;
                    return $data;
                });

            $categories = categorie::where('parent_id', 0)->get();

            return response()->json([
                'message' => 'Liste des produits recuperee avec succes',
                'produit' => $produits,
                'count' => Produit::count(),
                'AllProduit' => Produit::all(),
                'categories' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        if (!Gate::allows('add_product') && !Gate::allows('create_product')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de creer un produit.');
        }

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
                'categorie_id' => 'required',
                'genre' => 'nullable',
                'type' => 'nullable',
                'Dvie' => 'nullable',
                'reference' => 'nullable',
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

            if ($request->hasFile('logoP')) {
                $photoPath = $request->file('logoP')->store('logop', 'public');
                $data['logoP'] = 'storage/' . $photoPath;
            }

            $produit = Produit::create($data);

            if ($request->has('lines')) {
                $linesInput = $request->input('lines');
                $lines = is_string($linesInput) 
                    ? json_decode($linesInput, true) 
                    : $linesInput;
                
                if (is_array($lines)) {
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
            }

            if ($request->has('prixProduits')) {
                $prixInput = $request->input('prixProduits');
                if (is_array($prixInput)) {
                    foreach ($prixInput as $prix) {
                        $produit->prixProduits()->create([
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
                'message' => 'Produit ajouté avec succès',
                'produit' => array_merge(
                    $produit->toArray(),
                    ['logoP' => $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null]
                )
            ], 201);
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

            $produit = Produit::findOrFail($id);
            $data = $request->except(['prixProduits', 'lines']);
            $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
            $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
            $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;
            $data['user_id'] = Auth::id() ?: $produit->user_id;

            $produit->update($data);

            if ($request->has('lines')) {
                $produit->recettes()->delete(); 
                $linesInput = $request->input('lines');
                $lines = is_string($linesInput) 
                    ? json_decode($linesInput, true) 
                    : $linesInput;
                
                if (is_array($lines)) {
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
            }

            if ($request->has('prixProduits')) {
                $prixInput = $request->input('prixProduits');
                if (is_array($prixInput)) {
                    foreach ($prixInput as $prix) {
                        if (isset($prix['id']) && $prix['id']) {
                            $prixProduit = PrixProduit::where('id', $prix['id'])
                                ->where('produit_id', $produit->id)
                                ->firstOrFail();

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
            }

            return response()->json([
                'message' => 'Produit modifie avec succes',
                'produit' => array_merge(
                    $produit->toArray(),
                    ['logoP' => $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null]
                ),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateLogo(Request $request, $id)
    {
        try {
            $request->validate([
                'logoP' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            ]);

            $produit = Produit::findOrFail($id);

            if ($request->hasFile('logoP')) {
                if ($produit->logoP) {
                    $oldFilePath = str_replace('storage/', '', parse_url($produit->logoP, PHP_URL_PATH));
                    if (Storage::disk('public')->exists($oldFilePath)) {
                        Storage::disk('public')->delete($oldFilePath);
                    }
                }

                $photoPath = $request->file('logoP')->store('logop', 'public');
                $produit->logoP = 'storage/' . $photoPath;
            }

            $produit->save();

            return response()->json([
                'message' => 'Logo updated successfully!',
                'logoP' => $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null,
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
            $data = $produit->toArray();
            $data['logoP'] = $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null;

            return response()->json(['produit' => $data]);
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
            return response()->json(['message' => 'Produit supprime avec succes'], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] === 1451) {
                return response()->json([
                    'error' => 'Impossible de supprimer un produit car il est utilise dans d\'autres plateformes.',
                ], 400);
            }

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteSelected(Request $request)
    {
        $ids = $request->input('ids');

        if (empty($ids)) {
            return response()->json(['message' => 'Aucun element selectionne'], 400);
        }

        $errors = [];

        foreach ($ids as $id) {
            try {
                $produit = Produit::findOrFail($id);
                $produit->delete();
            } catch (\Illuminate\Database\QueryException $e) {
                if ($e->errorInfo[1] === 1451) {
                    $errors[] = "Produit #$id est utilise dans d'autres plateformes.";
                } else {
                    $errors[] = "Produit #$id: " . $e->getMessage();
                }
            }
        }

        if (!empty($errors)) {
            return response()->json(['errors' => $errors], 400);
        }

        return response()->json(['message' => 'Elements supprimes avec succes']);
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
            $produits = Produit::whereHas('stockProduit')
                ->with(['categorie', 'calibre', 'user', 'souscategorie', 'stockProduit'])
                ->get()
                ->map(function ($produit) {
                    $stock = $produit->stockProduit->first();
                    if ($stock) {
                        $quantite = ($stock->qte_kg_litre > 0) ? $stock->qte_kg_litre : $stock->qte_unite;
                    } else {
                        $quantite = 0;
                    }

                    return array_merge($produit->toArray(), [
                        'stock' => $quantite,
                    ]);
                });

            return response()->json([
                'message' => 'Liste des produits avec stock recuperee avec succes',
                'produits' => $produits,
            ], 200);
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

    public function chartProduitData()
    {
        $data = Produit::select('designation', 'stock_initial')->take(10)->get();
        return response()->json($data);
    }
}
