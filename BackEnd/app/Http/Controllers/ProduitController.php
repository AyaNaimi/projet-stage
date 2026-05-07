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
                'stockProduit',
                'recettes.matierePremiere'
            )->orderBy('id', 'desc')->get()
                ->map(function ($produit) {
                    $data = $produit->toArray();
                    $data['logoP'] = $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null;
                    return $data;
                });

            return response()->json([
                'message' => 'Liste des produits recuperee avec succes',
                'produit' => $produits,
                'count' => Produit::count(),
                'AllProduit' => Produit::all(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        if (!Gate::allows('create_product')) {
            abort(403, 'Vous n\'avez pas l\'autorisation de creer un produit.');
        }

        Log::info('debut de store');
        Log::info('request recu dans store', $request->all());

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
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
                'categorie_id' => 'required',
                'suCat_id' => 'nullable',
                'genre' => 'nullable',
                'type' => 'nullable',
                'Dvie' => 'nullable',
                'reference' => 'nullable',
                'tva' => 'nullable',
                'prixProduits' => 'nullable|array',
                'prixProduits.*.dateDebut' => 'nullable',
                'prixProduits.*.dateFin' => 'nullable',
                'prixProduits.*.prixProduit' => 'nullable',
                'prixProduits.*.typeQte' => 'nullable',
                'prixProduits.*.Unite' => 'nullable',
                'unite_etiquette' => 'nullable',
                'unite_embalage_primaire' => 'nullable',
                'unite_embalage_secondaire' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
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
            $produit->produit_Etiq_id = $request->input('produit_Etiq_id') ?: null;
            $produit->produit_Embalg_id = $request->input('produit_Embalg_id') ?: null;
            $produit->produit_Embalg_S_id = $request->input('produit_Embalg_S_id') ?: null;
            $produit->unite_etiquette = $request->input('unite_etiquette');
            $produit->unite_embalage_primaire = $request->input('unite_embalage_primaire');
            $produit->unite_embalage_secondaire = $request->input('unite_embalage_secondaire');
            $produit->user_id = Auth::id();

            if ($request->hasFile('logoP')) {
                $photoPath = $request->file('logoP')->store('logop', 'public');
                $produit->logoP = 'storage/' . $photoPath;
            }

            $produit->save();

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
                        ]);
                    }
                }
            }

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
                'message' => 'Produit ajoute avec succes',
                'produit' => array_merge(
                    $produit->toArray(),
                    ['logoP' => $produit->logoP ? asset(ltrim($produit->logoP, '/')) : null]
                ),
            ], 200);
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
                return response()->json(['error' => $validator->errors(), $request->all()], 400);
            }

            $produit = Produit::findOrFail($id);
            $data = $request->except(['prixProduits', 'lines']);
            $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
            $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
            $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;
            $data['user_id'] = Auth::id();

            $produit->update($data);

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
                        ]);
                    }
                }
            }

            if ($request->has('prixProduits')) {
                foreach ($request->input('prixProduits') as $prix) {
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
                'message' => 'Liste des produits avec stock recuperee avec succes',
                'produits' => $produits,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
