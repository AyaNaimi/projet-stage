<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // Récupérer tous les services
    public function index()
    {
        $services = Service::orderBy('id', 'desc')->get();
        return response()->json($services);
    }

    // Ajouter un nouveau service
    public function store(Request $request)
    {
        $request->validate([
            'service' => 'required|string|max:255'
        ]);

        $service = Service::create([
            'service' => $request->service
        ]);

        return response()->json($service, 201);
    }

    // Récupérer un service spécifique
    public function show($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }
        return response()->json($service);
    }

    // Mettre à jour un service
    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        $request->validate([
            'service' => 'required|string|max:255'
        ]);

        $service->update([
            'service' => $request->service
        ]);

        return response()->json($service);
    }

    // Supprimer un service
    public function destroy($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        $service->delete();
        return response()->json(['message' => 'Service supprimé avec succès']);
    }
}
