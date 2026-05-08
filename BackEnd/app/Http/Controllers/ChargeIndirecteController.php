<?php

namespace App\Http\Controllers;

use App\Models\ChargeIndirecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChargeIndirecteController extends Controller
{
    public function index()
    {
        try {
            $charges = ChargeIndirecte::all();
            return response()->json(['success' => true, 'data' => $charges], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'montant' => 'required|numeric|min:0',
                'frequence' => 'required|in:mensuel,annuel,trimestriel',
                'methode_repartition' => 'required|in:volume,quantite,temps_machine',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $charge = ChargeIndirecte::create($request->all());
            return response()->json(['message' => 'Charge indirecte ajoutée', 'data' => $charge], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $charge = ChargeIndirecte::findOrFail($id);
            $charge->update($request->all());
            return response()->json(['message' => 'Charge indirecte modifiée', 'data' => $charge], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $charge = ChargeIndirecte::findOrFail($id);
            $charge->delete();
            return response()->json(['message' => 'Charge indirecte supprimée'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function deleteSelected(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            if (empty($ids)) {
                return response()->json(['message' => 'Aucun ID fourni'], 400);
            }
            ChargeIndirecte::whereIn('id', $ids)->delete();
            return response()->json(['message' => 'Charges indirectes supprimées avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
