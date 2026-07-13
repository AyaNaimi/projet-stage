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
use Illuminate\Support\Facades\Schema;

class ProduitController extends Controller
{
    private function storeProductLogo($file)
    {
        $photoPath = $file->store('logop', 'public');

        return 'storage/' . $photoPath;
    }

    private function removeStoredLogo(?string $logoPath): void
    {
        if (!$logoPath) {
            return;
        }

        $relativePath = str_replace('storage/', '', parse_url($logoPath, PHP_URL_PATH) ?: $logoPath);

        if ($relativePath && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    private function formatProduit($produit)
    {
        $produit->logoP = $produit->logoP
            ? asset(ltrim($produit->logoP, '/'))
            : null;

        // Aliases expected by the frontend (lowercase keys)
        $produit->embalge = $produit->Embalge ?? $produit->embalge ?? null;
        $produit->embalge_s = $produit->EmbalgeS ?? $produit->embalge_s ?? null;
        $produit->etiquette_produit = $produit->etiquette ?? $produit->etiquette_produit ?? null;

        return $produit;
    }

    private function clearInvalidLogoInput(Request $request): void
    {
        $hasFile = $request->hasFile('logoP');
        $logoInput = $request->input('logoP');

        $shouldClear = !$hasFile && (
            $logoInput === false ||
            $logoInput === 'false' ||
            $logoInput === '' ||
            $logoInput === null ||
            (is_string($logoInput) && (
                str_starts_with($logoInput, 'http://') ||
                str_starts_with($logoInput, 'https://') ||
                str_starts_with($logoInput, '/storage/') ||
                str_starts_with($logoInput, 'storage/')
            ))
        );

        if ($shouldClear) {
            $request->request->remove('logoP');
            $request->files->remove('logoP');
            $request->offsetUnset('logoP');
        }
    }

    private function filterPayloadForTable(string $table, array $data): array
    {
        try {
            $columns = Schema::getColumnListing($table);
        } catch (\Throwable $e) {
            return $data;
        }

        return array_filter(
            $data,
            fn ($key) => in_array($key, $columns, true),
            ARRAY_FILTER_USE_KEY
        );
    }

    private function buildPrixProduitPayload(array $prix, int $produitId): array
    {
        return $this->filterPayloadForTable('prix_produits', [
            'produit_id' => $produitId,
            'dateDebut' => $prix['dateDebut'] ?? null,
            'dateFin' => $prix['dateFin'] ?? null,
            'prixProduit' => $prix['prixProduit'] ?? null,
            'typeQte' => $prix['typeQte'] ?? null,
            'Unite' => $prix['Unite'] ?? null,
        ]);
    }

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
        ])->orderBy('id', 'desc')->get();

        $produits->transform(fn ($produit) => $this->formatProduit($produit));

        $categories = categorie::where('idCatMer', 0)->get();

        return response()->json([
            'message' => 'Liste des produits recuperee avec succes',
            'produit' => $produits,
            'count' => Produit::count(),
            'AllProduit' => Produit::all(),
            'categories' => $categories
        ], 200);

    } catch (\Exception $e) {

        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
    }

    public function store(Request $request)
    {
        try {
            Log::info('[PRODUIT][STORE] incoming payload', [
                'keys' => array_keys($request->all()),
                'designation' => $request->input('designation'),
                'Code_produit' => $request->input('Code_produit'),
                'categorie_id' => $request->input('categorie_id'),
                'calibre_id' => $request->input('calibre_id'),
                'produit_Etiq_id' => $request->input('produit_Etiq_id'),
                'produit_Embalg_id' => $request->input('produit_Embalg_id'),
                'produit_Embalg_S_id' => $request->input('produit_Embalg_S_id'),
                'logoP' => $request->hasFile('logoP'),
            ]);

            $this->clearInvalidLogoInput($request);

            $validator = Validator::make($request->all(), [
                'Code_produit' => 'required|unique:produits,Code_produit',
                'designation' => 'required',
                'calibre_id' => 'nullable|exists:calibre,id',
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
                'logoP' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
                'produit_Etiq_id' => 'nullable|exists:produits,id',
                'produit_Embalg_id' => 'nullable|exists:produits,id',
                'produit_Embalg_S_id' => 'nullable|exists:produits,id',
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
                Log::warning('[PRODUIT][STORE] validation failed', [
                    'errors' => $validator->errors()->toArray(),
                ]);
                return response()->json(['error' => $validator->errors()], 400);
            }

            $data = $this->filterPayloadForTable('produits', $request->except(['prixProduits', 'lines']));
            $data['user_id'] = Auth::id();
            $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
            $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
            $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;

            if ($request->hasFile('logoP')) {
                $data['logoP'] = $this->storeProductLogo($request->file('logoP'));
            }

            Log::info('[PRODUIT][STORE] sanitized payload', [
                'data_keys' => array_keys($data),
                'produit_Etiq_id' => $data['produit_Etiq_id'] ?? null,
                'produit_Embalg_id' => $data['produit_Embalg_id'] ?? null,
                'produit_Embalg_S_id' => $data['produit_Embalg_S_id'] ?? null,
            ]);

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
                        $payload = $this->buildPrixProduitPayload($prix, $produit->id);
                        if (!empty($payload)) {
                            $produit->prixProduits()->create($payload);
                        }
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
        } catch (\Throwable $e) {
            Log::error('[PRODUIT][STORE] exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('[PRODUIT][UPDATE] incoming payload', [
                'id' => $id,
                'keys' => array_keys($request->all()),
                'designation' => $request->input('designation'),
                'Code_produit' => $request->input('Code_produit'),
                'categorie_id' => $request->input('categorie_id'),
                'calibre_id' => $request->input('calibre_id'),
                'produit_Etiq_id' => $request->input('produit_Etiq_id'),
                'produit_Embalg_id' => $request->input('produit_Embalg_id'),
                'produit_Embalg_S_id' => $request->input('produit_Embalg_S_id'),
                'logoP' => $request->hasFile('logoP'),
            ]);

            $this->clearInvalidLogoInput($request);

            $validator = Validator::make($request->all(), [
                'Code_produit' => 'required|unique:produits,Code_produit,' . $id,
                'designation' => 'required',
                'calibre_id' => 'nullable|exists:calibre,id',
                'type_quantite' => 'required',
                'unite' => 'nullable',
                'seuil_alerte' => 'nullable',
                'stock_initial' => 'nullable',
                'etat_produit' => 'nullable',
                'categorie_id' => 'required|exists:categories,id',
                'genre' => 'nullable',
                'Dvie' => 'nullable',
                'tva' => 'nullable',
                'logoP' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
                'produit_Etiq_id' => 'nullable|exists:produits,id',
                'produit_Embalg_id' => 'nullable|exists:produits,id',
                'produit_Embalg_S_id' => 'nullable|exists:produits,id',
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
                Log::warning('[PRODUIT][UPDATE] validation failed', [
                    'id' => $id,
                    'errors' => $validator->errors()->toArray(),
                ]);
                return response()->json(['error' => $validator->errors()], 400);
            }

            $produit = Produit::findOrFail($id);
            Log::info('[PRODUIT][UPDATE] existing product loaded', [
                'id' => $produit->id,
                'current_code' => $produit->Code_produit,
            ]);
            $data = $this->filterPayloadForTable('produits', $request->except(['prixProduits', 'lines']));
            $data['produit_Etiq_id'] = $request->input('produit_Etiq_id') ?: null;
            $data['produit_Embalg_id'] = $request->input('produit_Embalg_id') ?: null;
            $data['produit_Embalg_S_id'] = $request->input('produit_Embalg_S_id') ?: null;
            $data['user_id'] = Auth::id() ?: $produit->user_id;

            if ($request->hasFile('logoP')) {
                $this->removeStoredLogo($produit->logoP);
                $data['logoP'] = $this->storeProductLogo($request->file('logoP'));
            }

            Log::info('[PRODUIT][UPDATE] sanitized payload', [
                'id' => $id,
                'data_keys' => array_keys($data),
                'produit_Etiq_id' => $data['produit_Etiq_id'] ?? null,
                'produit_Embalg_id' => $data['produit_Embalg_id'] ?? null,
                'produit_Embalg_S_id' => $data['produit_Embalg_S_id'] ?? null,
            ]);

            $produit->update($data);

            if ($request->has('lines')) {
               // $produit->recettes()->delete(); 
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

                            $prixPayload = $this->buildPrixProduitPayload($prix, $produit->id);
                            if (!empty($prixPayload)) {
                                $prixProduit->update($prixPayload);
                            }
                        } else {
                            $prixPayload = $this->buildPrixProduitPayload($prix, $produit->id);
                            if (!empty($prixPayload)) {
                                $produit->prixProduits()->create($prixPayload);
                            }
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
        } catch (\Throwable $e) {
            Log::error('[PRODUIT][UPDATE] exception', [
                'id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);
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
                $this->removeStoredLogo($produit->logoP);
                $produit->logoP = $this->storeProductLogo($request->file('logoP'));
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
                    $produit = $this->formatProduit($produit);
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
            ->with(['categorie', 'calibre', 'user', 'souscategorie', 'prixProduits', 'prixProduitsLast', 'Embalge', 'etiquette', 'EmbalgeS', 'stockProduit', 'recettes.matierePremiere'])
            ->get()
            ->map(fn ($produit) => $this->formatProduit($produit));
        return response()->json(['produits' => $produits]);
    }

    public function byCategorie($categorieId)
    {
        $produits = Produit::where('categorie_id', $categorieId)
            ->with(['categorie', 'calibre', 'user', 'souscategorie', 'prixProduits', 'prixProduitsLast', 'Embalge', 'etiquette', 'EmbalgeS', 'stockProduit', 'recettes.matierePremiere'])
            ->get()
            ->map(fn ($produit) => $this->formatProduit($produit));
        return response()->json(['produits' => $produits]);
    }

    public function chartProduitData()
    {
        $data = Produit::select('designation', 'stock_initial')->take(10)->get();
        return response()->json($data);
    }
}
