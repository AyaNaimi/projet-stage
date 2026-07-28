<?php

namespace App\Http\Controllers;

use App\Models\GpCalendrierEmploye;
use Illuminate\Http\Request;

class GpCalendrierEmployeController extends Controller
{
    /**
     * List all planning entries for a given employee.
     * GET /api/calendriers-employes?employe_id=X
     */
    public function index(Request $request)
    {
        $query = GpCalendrierEmploye::with('calendrier');

        if ($request->has('employe_id')) {
            $query->where('employe_id', $request->employe_id);
        }

        return response()->json($query->orderBy('date_debut')->get());
    }

    /**
     * Create a new planning entry.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employe_id'   => 'required|exists:employes,id',
            'calendrier_id' => 'required|exists:calendries,id',
            'date_debut'   => 'required|date',
            'date_fin'     => 'required|date|after_or_equal:date_debut',
        ]);

        $entry = GpCalendrierEmploye::create($request->only([
            'employe_id', 'calendrier_id', 'date_debut', 'date_fin',
        ]));

        return response()->json($entry->load('calendrier'), 201);
    }

    /**
     * Show a single entry.
     */
    public function show(string $id)
    {
        $entry = GpCalendrierEmploye::with('calendrier')->find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entrée non trouvée'], 404);
        }
        return response()->json($entry);
    }

    /**
     * Update a planning entry.
     */
    public function update(Request $request, string $id)
    {
        $entry = GpCalendrierEmploye::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entrée non trouvée'], 404);
        }

        $request->validate([
            'calendrier_id' => 'sometimes|required|exists:calendries,id',
            'date_debut'    => 'sometimes|required|date',
            'date_fin'      => 'sometimes|required|date',
        ]);

        $entry->update($request->only(['calendrier_id', 'date_debut', 'date_fin']));

        return response()->json($entry->load('calendrier'));
    }

    /**
     * Delete a planning entry.
     */
    public function destroy(string $id)
    {
        $entry = GpCalendrierEmploye::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entrée non trouvée'], 404);
        }

        $entry->delete();
        return response()->json(null, 204);
    }
}
