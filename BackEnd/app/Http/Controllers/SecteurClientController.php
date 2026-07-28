<?php

namespace App\Http\Controllers;

use App\Models\SecteurClient; // Assurez-vous d'importer le modèle
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SecteurClientController extends Controller
{
    /**
     * Affiche la liste des secteurs clients.
     */
    public function index()
    {
        $secteursClients = SecteurClient::orderBy('id', 'desc')->get(); // Récupère tous les secteurs clients
        return response()->json($secteursClients); // Retourne les données en format JSON
    }

    /**
     * Stocke un nouveau secteur client.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type'=>''
,
            'secteurClient' => 'required|string|max:255', // Validation des données
            'logoP' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Category logo validation

        ]);
        $secteur = new SecteurClient
        ();
        $secteur->secteurClient = $request->input('secteurClient');
        if ($request->hasFile('logoP')) {
            $logoPath = $request->file('logoP')->store('public/logoP'); // Store logo in public/logoc directory
            $secteur->logoP = Storage::url($logoPath); // Save the public path to the logo
            $secteur->type =$request->input('type');// Save the public path to the logo

        }
        $secteurClient= $secteur->save();

        return response()->json($secteurClient, 201); // Retourne le secteur créé avec un code 201
    }

    /**
     * Affiche un secteur client spécifique.
     */
    public function show($id)
    {
        $secteurClient = SecteurClient::findOrFail($id); // Trouve le secteur client ou renvoie une erreur 404
        return response()->json($secteurClient);
    }

    /**
     * Met à jour un secteur client existant.
     */
    public function update(Request $request, $id)
    {
        // Validation des données d'entrée
        $request->validate([
            'type'=>'',

            'secteurClient' => 'required|string|max:255', // Validation des données
            'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation du logo, facultatif

        ]);
    
        // Récupérer le SecteurClient existant par ID
        $secteur = SecteurClient::find($id);
    
        if (!$secteur) {
            return response()->json(['message' => 'SecteurClient non trouvé'], 404); // Retourne une erreur 404 si non trouvé
        }
    
        // Mettre à jour les données
        $secteur->secteurClient = $request->input('secteurClient');
    
        // Gérer la mise à jour de l'image si elle est présente
        if ($request->hasFile('logoP')) {
            // Supprimer l'ancienne image si elle existe
            if ($secteur->logoP) {
                Storage::delete(str_replace('/storage/', 'public/', $secteur->logoP));
            }
    
            // Stocker la nouvelle image
            $logoPath = $request->file('logoP')->store('public/logoP'); // Enregistre le logo dans le répertoire public/logoP
            $secteur->logoP = Storage::url($logoPath); // Sauvegarde le chemin public du logo
        }
    
        $secteur->save(); // Enregistre les modifications
    
        return response()->json(['message' => 'SecteurClient mis à jour avec succès', 'secteurClient' => $secteur], 200); // Retourne le secteur mis à jour avec un code 200
    }
    

    /**
     * Supprime un secteur client.
     */
    public function destroy($id)
    {
        $secteurClient = SecteurClient::findOrFail($id);
        $secteurClient->delete(); // Supprime le secteur client

        return response()->json(null, 204); // Retourne un code 204 No Content
    }
}
