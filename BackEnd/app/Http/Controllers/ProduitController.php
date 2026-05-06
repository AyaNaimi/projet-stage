<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\PrixProduit;
use App\Models\Produit;
use Hamcrest\Arrays\IsArray;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index()
    {
        // Vérifier si l'utilisateur a la permission de voir la liste des produits
            try {
                $produits = Produit::with('categorie', 'calibre', 'user','souscategorie','prixProduits','prixProduitsLast','Embalge','etiquette','EmbalgeS','stockProduit')->orderBy('id', 'desc')->get();
                $count = Produit::count();
                $Categorie=Categorie::with('produits')->get();

                return response()->json([
                    'message' => 'Liste des produits récupérée avec succès', 'produit' => $produits,
                    'count' => $count,
                    'AllProduit' =>Produit::all(),

                ], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
      
    }



    public function store(Request $request)
    {
        if (Gate::allows('create_product')) {

            log::info('debut de store');
            log::info('request reçu dans store', $request->all());
            try {
                $validator = Validator::make($request->all(), [
                    'Code_produit' => 'required',
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
                    'tva' => 'nullable',




'prixProduits' => 'nullable',
'prixProduits.*.id' => 'nullable',

                'prixProduits.*.dateDebut' => 'nullable',
                'prixProduits.*.dateFin' => 'nullable',
                'prixProduits.*.prixProduit' => 'nullable',
                'prixProduits.*.typeQte' => 'nullable',
                'prixProduits.*.Unite' => 'nullable',
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                // $request['user_id'] = Auth::id();
                // $produit = Produit::create($request->all());
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

                \Log::info('DB utilisée par Laravel : ' . \DB::connection()->getDatabaseName());

               $produit->save();

                $prixProduits = $request->input('prixProduits');
                if(is_array($prixProduits)){
                     foreach ($prixProduits as $prix) {
                    $produit->prixProduits()->create([
                        'produit_id' => $produit->id,
                        'dateDebut' => $prix['dateDebut'],
                        'dateFin' => $prix['dateFin'],
                        'prixProduit' => $prix['prixProduit']??null,
                        'typeQte' => $prix['typeQte']??null,
                        'Unite' => $prix['Unite']??null,
                    ]);
                }
                }
               
                return response()->json(['message' => 'Produit ajouté avec succès', 'produit' => $produit], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer un produit.');
        }
    }

    public function updateLogo(Request $request, $id)
    {
        try {
            // Validate the request
            $request->validate([
                'logoP' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
    
            // Find the product by ID
            $produit = Produit::findOrFail($id);
    
            // Check if a file is uploaded
            if ($request->hasFile('logoP')) {
                // Delete the old logo if it exists
                if ($produit->logoP) {
                    $oldFilePath = str_replace('/storage', 'public', $produit->logoP);
                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                    }
                }
    
                // Store the new logo
                $photoPath = $request->file('logoP')->store('public/logop');
                $produit->logoP = Storage::url($photoPath); // Save the URL of the new file
            }
    
            // Save the updated product
            $produit->save();
    
            // Return success response
            return response()->json([
                'message' => 'Logo updated successfully!',
                'logoP' => $produit->logoP,
            ], 200);
            
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error($e->getMessage());
            
            // Return error response
            return response()->json([
                'error' => 'Failed to update logo',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    


    public function show($id)
    {
        // Vérifier si l'utilisateur a la permission de voir un produit spécifique
        // if (Gate::allows('view_product')) {
        try {
            $produit = Produit::with('calibre', 'categorie')->findOrFail($id);

            return response()->json(['produit' => $produit]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation de voir ce produit.');
        // }
    }


    public function update(Request $request, $id)
    {
        if (Gate::allows('edit_product')) {
            try {
                // Validation des données du formulaire
                $validator = Validator::make($request->all(), [
                    'Code_produit' => 'required' ,
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

'prixProduits' => 'nullable', // Validation des prix
                'prixProduits.*.dateDebut' => 'nullable|date',
                'prixProduits.*.dateFin' => 'nullable|date|after_or_equal:prixProduits.*.dateDebut',
                'prixProduits.*.prixProduit' => 'nullable|numeric|min:0',
                'prixProduits.*.typeQte' => 'nullable',
                'prixProduits.*.Unite' => 'nullable',
                ]);

                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors(),$request->all()], 400);
                }
                $request['user_id'] = Auth::id(); // Ajoutez ceci


                $produit = Produit::findOrFail($id);
                $data = $request->except('prixProduits');  // Exclure 'prixProduits'

                $produit->update($data);
                if ($request->has('prixProduits')) {
                    foreach ($request->input('prixProduits') as $prix) {
                        if (isset($prix['id'])) {
                            $prixProduit = PrixProduit::findOrFail($prix['id']);
                            $prixProduit->update([
                                'dateDebut' => $prix['dateDebut']??null,
                                'dateFin' => $prix['dateFin'],
                                'prixProduit' => $prix['prixProduit']??null,
                                'typeQte' => $prix['typeQte']??null,
                                'Unite' => $prix['Unite']??null,
                            ]);
                        }else {
                            // Ajouter un nouveau prix
                            $produit->prixProduits()->create([
                                'produit_id' => $produit->id,
                                'dateDebut' => $prix['dateDebut']??null,
                                'dateFin' => $prix['dateFin']??null,
                                'prixProduit' => $prix['prixProduit']??null,
                                'typeQte' => $prix['typeQte']??null,
                                'Unite' => $prix['Unite']??null,
                            ]);
                        }
                    }
                }
                return response()->json(['message' => 'Produit modifié avec succès', 'produit' => $produit], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } else {
            abort(403, 'Vous n\'avez pas l\'autorisation de modifier ce produit.');
        }
    }

    public function destroy($id)
    {
        // Vérifier si l'utilisateur a la permission de supprimer un produit
        if (Gate::allows('delete_product')) {
            try {
                $produit = Produit::findOrFail($id);
                $produit->delete();
    
                return response()->json(['message' => 'Produit supprimé avec succès'], 200);
            } catch (\Illuminate\Database\QueryException $e) {
                // Vérifier si l'erreur est liée à une contrainte d'intégrité
                if ($e->errorInfo[1] === 1451) {
                    // Renvoyer le message d'erreur spécifique
                    return response()->json(['error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.'], 400);
                } else {
                    // Renvoyer l'erreur par défaut
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            }
        } else {
            abort(403, 'Vous n\'avez pas l\'autorisation de supprimer ce produit.');
        }
    }

    public function deleteSelected(Request $request)
    {
        $ids = $request->input('ids'); // Récupère les IDs sélectionnés

        if (!empty($ids)) {
            for ($i = 0; $i < count($ids); $i++) {
 try {
                $produit = Produit::findOrFail($ids[$i]);
                $produit->delete();
    
                return response()->json(['message' => 'Produit supprimé avec succès'], 200);
            } catch (\Illuminate\Database\QueryException $e) {
                // Vérifier si l'erreur est liée à une contrainte d'intégrité
                if ($e->errorInfo[1] === 1451) {
                    // Renvoyer le message d'erreur spécifique
                    return response()->json(['error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.'], 400);
                } else {
                    // Renvoyer l'erreur par défaut
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            }            }
            return response()->json(['message' => 'Éléments supprimés avec succès']);
        }

        return response()->json(['message' => 'Aucun élément sélectionné'], 400);
    }
    public function destroyPrix($id)
    {
        // Vérifier si l'utilisateur a la permission de supprimer un produit
            try {
                $produit = PrixProduit::findOrFail($id);
                $produit->delete();
    
                return response()->json(['message' => 'Produit supprimé avec succès'], 200);
            } catch (\Illuminate\Database\QueryException $e) {
                // Vérifier si l'erreur est liée à une contrainte d'intégrité
                if ($e->errorInfo[1] === 1451) {
                    // Renvoyer le message d'erreur spécifique
                    return response()->json(['error' => 'Impossible de supprimer un produit car il est utilisé dans d\'autres plateformes.'], 400);
                } else {
                    // Renvoyer l'erreur par défaut
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
    
                    $quantite = ($stock->qte_kg_litre > 0) ? $stock->qte_kg_litre : $stock->qte_unite;
    
                    return array_merge($produit->toArray(), [
                        'stock' => $quantite,
                    ]);
                });
    
            return response()->json([
                'message' => 'Liste des produits avec stock récupérée avec succès',
                'produits' => $produits
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
