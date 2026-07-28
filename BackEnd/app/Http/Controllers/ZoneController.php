<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $zone = Zone::orderBy('id', 'desc')->get();
            $count = Zone::count();

            return response()->json([
                'message' => 'Liste des zones récupérée avec succès', 'zone' => $zone,
                'count' => $count
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation de voir la liste des produits.');
        // }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $zone = Zone::create($request->all());
        return response()->json($zone, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $zone = Zone::find($id);
        return response()->json($zone);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Zone $zone)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $zone = Zone::findOrFail($id);
        $zone->update($request->all());
        return response()->json($zone, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Zone::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}