<?php

namespace App\Http\Controllers;

use App\Models\ProduitPackaging;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProduitPackagingController extends Controller
{
    public function index($produitId)
    {
        $lignes = ProduitPackaging::with('packaging.prixProduitsLast')
            ->where('produit_id', $produitId)
            ->get();

        return response()->json(['lignes' => $lignes]);
    }

    public function sync(Request $request, $produitId)
    {
        $validator = Validator::make($request->all(), [
    'lignes' => 'nullable|array',
    'lignes.*.packaging_id' => 'required|exists:produits,id',
    'lignes.*.quantite' => 'required|numeric|min:0',
    'lignes.*.perte' => 'nullable|numeric|min:0|max:100',
]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            return DB::transaction(function () use ($request, $produitId) {
                ProduitPackaging::where('produit_id', $produitId)->delete();

                foreach ($request->lignes as $ligne) {
                    ProduitPackaging::create([
                        'produit_id' => $produitId,
                        'packaging_id' => $ligne['packaging_id'],
                        'quantite' => $ligne['quantite'],
                        'perte' => $ligne['perte'] ?? 0,
                    ]);
                }

                $lignes = ProduitPackaging::with('packaging.prixProduitsLast')
                    ->where('produit_id', $produitId)
                    ->get();

                return response()->json(['message' => 'Packagings synchronises', 'lignes' => $lignes], 200);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}