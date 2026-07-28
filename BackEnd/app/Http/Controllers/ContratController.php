<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contrat;

class ContratController extends Controller
{
    public function index() { return response()->json([]); }
    public function store(Request $request) { return response()->json([], 201); }
    public function show($id) { return response()->json([]); }
    public function update(Request $request, $id) { return response()->json([]); }
    public function destroy($id) { return response()->json([], 204); }

    public function getContratsByEmploye($employeId) {
        try {
            $contrats = Contrat::where('employe_id', $employeId)->get();
            return response()->json($contrats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des contrats: ' . $e->getMessage()], 500);
        }
    }
}
