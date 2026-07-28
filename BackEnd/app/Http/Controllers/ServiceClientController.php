<?php

namespace App\Http\Controllers;

use App\Models\ServiceClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceClientController extends Controller
{
    /**
     * Affiche la liste des services clients.
     */
    public function index()
    {
        $services = ServiceClient::with('secteur')->orderBy('id', 'desc')->get();
        return response()->json($services);
    }

    /**
     * Crée un nouveau service client.
     */
    public function store(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'id_secteur' => 'required|exists:secteur_clients,id',
            'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation de l'image
        ]);
    
        $serviceClient = new ServiceClient();
        $serviceClient->service = $request->input('service');
        $serviceClient->id_secteur = $request->input('id_secteur');
    
        // Enregistrement de l'image si elle est présente dans la requête
        if ($request->hasFile('logoP')) {
            $photoPath = $request->file('logoP')->store('public/logoP');
            $serviceClient->photo = Storage::url($photoPath); // Sauvegarde du chemin public de l'image
        }
    
        $serviceClient->save();
    
        return response()->json($serviceClient, 201);
    }
    

    /**
     * Affiche un service client spécifique.
     */
    public function show($id)
    {
        $serviceClient = ServiceClient::with('secteur')->findOrFail($id);
        return response()->json($serviceClient);
    }

    /**
     * Met à jour un service client spécifique.
     */
public function update(Request $request, $id)
{
    $serviceClient = ServiceClient::findOrFail($id);

    $request->validate([
        'service' => 'sometimes|required|string',
        'id_secteur' => 'sometimes|required|exists:secteur_clients,id',
        'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation de l'image
    ]);

    if ($request->has('service')) {
        $serviceClient->service = $request->input('service');
    }

    if ($request->has('id_secteur')) {
        $serviceClient->id_secteur = $request->input('id_secteur');
    }

    // Traitement de l'image si elle est présente dans la requête
    if ($request->hasFile('logoP')) {
        // Suppression de l'ancienne image s'il y en a une
        if ($serviceClient->photo) {
            Storage::delete(str_replace('/storage/', 'public/', $serviceClient->photo));
        }

        // Enregistrement de la nouvelle image
        $photoPath = $request->file('logoP')->store('public/logoP');
        $serviceClient->photo = Storage::url($photoPath); // Sauvegarde du chemin public de l'image
    }

    $serviceClient->save();

    return response()->json($serviceClient);
}

    /**
     * Supprime un service client.
     */
    public function destroy($id)
    {
        $serviceClient = ServiceClient::findOrFail($id);
        $serviceClient->delete();

        return response()->json(['message' => 'Service client supprimé avec succès']);
    }
}
