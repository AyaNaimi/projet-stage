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
        $produit->etiquette = $produit->etiquette ?? null;

        return $produit;
    }

    /**
     * Convertit les chaînes vides en null pour les champs nullable.
     * Empêche les erreurs de validation "nullable|numeric" quand le frontend envoie "".
     */
    private function emptyStringsToNull(Request $request): void
    {
        $nullableFields = [
            'seuil_alerte', 'stock_initial', 'prix_vente', 'grammage', 'rendement',
            'temps_production', 'cout_horaire_mod', 'quantite_production_mensuelle', 'temps_machine',
            'calibre_id', 'suCat_id', 'categorie_id', 'genre', 'type', 'Dvie', 'reference', 'tva',
            'marque', 'etat_produit', 'unite', 'reference',
            'produit_Etiq_id', 'produit_Embalg_id', 'produit_Embalg_S_id',
            'unite_etiquette', 'unite_embalage_primaire', 'unite_embalage_secondaire',
            'emballage_primaire_label', 'emballage_secondaire_label', 'etiquette_label',
        ];
        foreach ($nullableFields as $field) {
            $val = $request->input($field);
            if ($val === '' || $val === null) {
                $request->request->remove($field);
            }
            // For ID fields, ensure they are valid integers or remove them
            if (in_array($field, ['produit_Etiq_id', 'produit_Embalg_id', 'produit_Embalg_S_id'])) {
                if (!is_null($val) && !ctype_digit((string)$val)) {
                    $request->request->remove($field);
                    Log::warning('[PRODUIT] Removed invalid ID field', ['field' => $field, 'value' => $val]);
                }
            }
        }
    }

    private function clearInvalidLogoInput(Request $request): void
    {
        // Always remove logoP from request — it should only be re-added if it's a valid file
        $request->request->remove('logoP');
        $request->files->remove('logoP');
        $request->offsetUnset('logoP');

        // Only restore it if a valid file was actually uploaded
        if ($request->hasFile('logoP')) {
            $file = $request->file('logoP');
            if ($file->isValid() && $file->getSize() > 0) {
                // Re-add the valid file
                $request->files->set('logoP', $file);
            }
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

    public function index(Request $request)
    {
        try {
            $isDirectCharges = $request->query('directes') || $request->query('minimal');

            $query = Produit::orderBy('id', 'desc');

            if ($isDirectCharges) {
                $query = $query->select([
                    'id',
                    'designation',
                    'Code_produit',
                    'categorie_id',
                    'suCat_id',
                    'temps_production',
                    'cout_horaire_mod',
                    'logoP',
                    'produit_Etiq_id',
                    'produit_Embalg_id',
                    'produit_Embalg_S_id',
                ])->with(['categorie', 'souscategorie', 'Embalge', 'etiquette', 'EmbalgeS']);
            } else {
                $query = $query->with([
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
                ]);
            }

            $produits = $query->get();

            if ($isDirectCharges) {
                $produits->each(function ($produit) {
                    $produit->makeHidden(['unit_cost', 'logo_url']);
                });
            }

            $produits->transform(fn ($produit) => $this->formatProduit($produit));

            $categories = categorie::where('idCatMer', 0)->get();

            return response()->json([
                'message' => 'Liste des produits recuperee avec succes',
                'produit' => $produits,
                'count' => $produits->count(),
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

            $this->emptyStringsToNull($request);
            $this->clearInvalidLogoInput($request);

            $validator = Validator::make($request->all(), [
                'Code_produit' => 'required|string|min:2|max:50|unique:produits,Code_produit',
                'designation' => 'required|string|min:2|max:255',
                'calibre_id' => 'nullable|exists:calibre,id',
                'type_quantite' => 'required|in:kg,unite,litre,kg/unite,M,bidon,Carton',
                'unite' => 'nullable|string|max:10',
                'seuil_alerte' => 'nullable|numeric|min:0|max:999999',
                'stock_initial' => 'nullable|numeric|min:0|max:999999',
                'etat_produit' => 'nullable|string|max:50',
                'categorie_id' => 'required|exists:categories,id',
                'genre' => 'nullable|in:vente,achat,venteachat',
                'type' => 'nullable|in:M,P',
                'Dvie' => 'nullable|string|max:100',
                'reference' => 'nullable|string|max:100',
                'tva' => 'nullable|numeric|min:0|max:100',
                'logoP' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp,svg,bmp,tiff,ico|max:5120',
                'produit_Etiq_id' => 'nullable',
                'produit_Embalg_id' => 'nullable',
                'produit_Embalg_S_id' => 'nullable',
                'prix_vente' => 'nullable|numeric|min:0|max:999999',
                'grammage' => 'nullable|numeric|min:0|max:99999',
                'rendement' => 'nullable|numeric|min:0|max:100',
                'temps_production' => 'nullable|numeric|min:0|max:1440',
                'cout_horaire_mod' => 'nullable|numeric|min:0|max:99999',
                'quantite_production_mensuelle' => 'nullable|numeric|min:0|max:99999999',
                'temps_machine' => 'nullable|numeric|min:0|max:1440',
                'prixProduits' => 'nullable|array',
                'prixProduits.*.dateDebut' => 'nullable|date',
                'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                'prixProduits.*.typeQte' => 'nullable',
                'prixProduits.*.Unite' => 'nullable',
                'unite_etiquette' => 'nullable|string|max:50',
                'unite_embalage_primaire' => 'nullable|string|max:50',
                'unite_embalage_secondaire' => 'nullable|string|max:50',
                'emballage_primaire_label' => 'nullable|string|max:255',
                'emballage_secondaire_label' => 'nullable|string|max:255',
                'etiquette_label' => 'nullable|string|max:255',
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

            $this->emptyStringsToNull($request);
            $this->clearInvalidLogoInput($request);

            $validator = Validator::make($request->all(), [
                'Code_produit' => 'required|string|min:2|max:50|unique:produits,Code_produit,' . $id,
                'designation' => 'required|string|min:2|max:255',
                'calibre_id' => 'nullable|exists:calibre,id',
                'type_quantite' => 'required|in:kg,unite,litre,kg/unite,M,bidon,Carton',
                'unite' => 'nullable|string|max:10',
                'seuil_alerte' => 'nullable|numeric|min:0|max:999999',
                'stock_initial' => 'nullable|numeric|min:0|max:999999',
                'etat_produit' => 'nullable|string|max:50',
                'categorie_id' => 'required|exists:categories,id',
                'genre' => 'nullable|in:vente,achat,venteachat',
                'Dvie' => 'nullable|string|max:100',
                'tva' => 'nullable|numeric|min:0|max:100',
                'logoP' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp,svg,bmp,tiff,ico|max:5120',
                'produit_Etiq_id' => 'nullable',
                'produit_Embalg_id' => 'nullable',
                'produit_Embalg_S_id' => 'nullable',
                'prix_vente' => 'nullable|numeric|min:0|max:999999',
                'grammage' => 'nullable|numeric|min:0|max:99999',
                'rendement' => 'nullable|numeric|min:0|max:100',
                'temps_production' => 'nullable|numeric|min:0|max:1440',
                'cout_horaire_mod' => 'nullable|numeric|min:0|max:99999',
                'quantite_production_mensuelle' => 'nullable|numeric|min:0|max:99999999',
                'temps_machine' => 'nullable|numeric|min:0|max:1440',
                'prixProduits' => 'nullable|array',
                'prixProduits.*.dateDebut' => 'nullable|date',
                'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                'prixProduits.*.typeQte' => 'nullable',
                'prixProduits.*.Unite' => 'nullable',
                'unite_etiquette' => 'nullable|string|max:50',
                'unite_embalage_primaire' => 'nullable|string|max:50',
                'unite_embalage_secondaire' => 'nullable|string|max:50',
                'emballage_primaire_label' => 'nullable|string|max:255',
                'emballage_secondaire_label' => 'nullable|string|max:255',
                'etiquette_label' => 'nullable|string|max:255',
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
                'logoP' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg,bmp,tiff,ico|max:5120',
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

    /**
     * Mise à jour partielle des champs de charges directes (MOD) uniquement.
     * N'exige pas designation / Code_produit / type_quantite / categorie_id.
     *
     * PATCH /api/produits/{id}/charges-directes
     * Body : { cout_horaire_mod: float, temps_production: float }
     */
    public function updateChargesDirectes(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cout_horaire_mod'  => 'nullable|numeric|min:0',
                'temps_production'  => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $produit = Produit::findOrFail($id);

            $produit->update($request->only(['cout_horaire_mod', 'temps_production']));

            return response()->json([
                'message' => 'Charges directes mises à jour',
                'produit' => [
                    'id'               => $produit->id,
                    'cout_horaire_mod' => $produit->cout_horaire_mod,
                    'temps_production' => $produit->temps_production,
                ],
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['error' => 'Produit introuvable.'], 404);
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

    /**
     * Import produits depuis un fichier CSV
     * Headers attendus : Code_produit,designation,categorie,prix_vente,type_quantite,
     *                    unite,seuil_alerte,stock_initial,grammage,temps_production,
     *                    cout_horaire_mod,quantite_production_mensuelle,temps_machine,
     *                    emballage_primaire_label,emballage_secondaire_label,etiquette_label
     */
    public function importCsv(Request $request)
    {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['message' => 'Fichier CSV manquant'], 400);
            }

            $file = $request->file('file');
            $path = $file->getRealPath();
            $handle = fopen($path, 'r');
            if ($handle === false) {
                return response()->json(['message' => 'Impossible d\'ouvrir le fichier'], 500);
            }

            $header = null;
            $imported = 0;
            $updated = 0;
            $skippedRows = [];

            // Map existante : Code_produit => Produit
            $existingProduits = Produit::all()->keyBy('Code_produit');

            $lineNumber = 0;
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $lineNumber++;
                if (!$header) {
                    $header = array_map('trim', $row);
                    continue;
                }
                if (count($header) !== count($row)) {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Nombre de colonnes incorrect'];
                    continue;
                }
                $data = array_combine($header, $row);
                if (!$data) {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Ligne vide ou en-têtes incorrectes'];
                    continue;
                }

                // ── Champs obligatoires ──
                $codeProduit = isset($data['Code_produit']) ? trim($data['Code_produit']) : null;
                $designation = isset($data['designation']) ? trim($data['designation']) : null;

                if (!$codeProduit || !$designation) {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Code_produit ou designation manquant'];
                    continue;
                }

                // ── Catégorie (lookup par nom) ──
                $categorieId = null;
                $categorieNom = $data['categorie'] ?? null;
                if ($categorieNom) {
                    $cat = categorie::whereRaw('LOWER(categorie) = ?', [strtolower(trim($categorieNom))])->first();
                    if ($cat) {
                        $categorieId = $cat->id;
                    } else {
                        $cat = categorie::create([
                            'categorie' => trim($categorieNom),
                            'logoP'     => 'default.png',
                            'idCatMer'  => 0,
                        ]);
                        $categorieId = $cat->id;
                    }
                }

                // ── Champs numériques ──
                $prixVente = $this->parseNumeric($data['prix_vente'] ?? null);
                $seuilAlerte = $this->parseNumeric($data['seuil_alerte'] ?? null);
                $stockInitial = $this->parseNumeric($data['stock_initial'] ?? null);
                $grammage = $this->parseNumeric($data['grammage'] ?? null);
                $tempsProduction = $this->parseNumeric($data['temps_production'] ?? null);
                $coutHoraireMod = $this->parseNumeric($data['cout_horaire_mod'] ?? null);
                $quantiteMensuelle = $this->parseNumeric($data['quantite_production_mensuelle'] ?? null);
                $tempsMachine = $this->parseNumeric($data['temps_machine'] ?? null);

                $payload = [
                    'Code_produit'                 => $codeProduit,
                    'designation'                  => $designation,
                    'type_quantite'                => $data['type_quantite'] ?? 'K',
                    'unite'                        => $data['unite'] ?? null,
                    'categorie_id'                 => $categorieId,
                    'prix_vente'                   => $prixVente,
                    'seuil_alerte'                 => $seuilAlerte,
                    'stock_initial'                => $stockInitial,
                    'etat_produit'                 => $data['etat_produit'] ?? 'actif',
                    'marque'                       => $data['marque'] ?? null,
                    'tva'                          => $data['tva'] ?? '20',
                    'reference'                    => $data['reference'] ?? null,
                    'grammage'                     => $grammage,
                    'rendement'                    => $this->parseNumeric($data['rendement'] ?? 100),
                    'temps_production'             => $tempsProduction,
                    'cout_horaire_mod'             => $coutHoraireMod,
                    'quantite_production_mensuelle' => $quantiteMensuelle,
                    'temps_machine'                => $tempsMachine,
                    'emballage_primaire_label'     => $data['emballage_primaire_label'] ?? null,
                    'emballage_secondaire_label'   => $data['emballage_secondaire_label'] ?? null,
                    'etiquette_label'              => $data['etiquette_label'] ?? null,
                    'unite_etiquette'              => $data['unite_etiquette'] ?? null,
                    'unite_embalage_primaire'      => $data['unite_embalage_primaire'] ?? null,
                    'unite_embalage_secondaire'    => $data['unite_embalage_secondaire'] ?? null,
                ];

                if (isset($existingProduits[$codeProduit])) {
                    $existingProduits[$codeProduit]->update($payload);
                    $updated++;
                } else {
                    $payload['user_id'] = Auth::id();
                    Produit::create($payload);
                    $imported++;
                }
            }
            fclose($handle);

            $response = ['imported' => $imported, 'updated' => $updated];

            if (!empty($skippedRows)) {
                $logHeader = ['line', 'raw', 'reason'];
                $csvLines[] = implode(',', $logHeader);
                foreach ($skippedRows as $r) {
                    $csvLines[] = sprintf('"%s","%s","%s"', $r['line'], str_replace('"', '""', $r['raw']), str_replace('"', '""', $r['reason']));
                }
                $content = implode("\n", $csvLines);
                $fileName = 'import_logs/produit_import_' . now()->format('Ymd_His') . '.csv';
                Storage::put('public/' . $fileName, $content);
                $response['log_url'] = Storage::url('public/' . $fileName);
                $response['skipped'] = count($skippedRows);
            }

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function parseNumeric($value): ?float
    {
        if ($value === null || $value === '') return null;
        $cleaned = str_replace(',', '.', trim($value));
        return is_numeric($cleaned) ? (float) $cleaned : null;
    }
}
