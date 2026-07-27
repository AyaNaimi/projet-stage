<?php

namespace App\Http\Controllers;

use App\Models\Calendrie;
use Illuminate\Http\Request;

class CalendrieController extends Controller
{
    public function index()
    {
        $calendriers = Calendrie::orderBy('nom')->get();
        return response()->json($calendriers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $calendrier = Calendrie::create($request->only('nom'));
        return response()->json($calendrier, 201);
    }

    public function show($id)
    {
        $calendrier = Calendrie::find($id);
        if (!$calendrier) {
            return response()->json(['message' => 'Calendrier non trouvé'], 404);
        }
        return response()->json($calendrier);
    }

    public function update(Request $request, $id)
    {
        $calendrier = Calendrie::find($id);
        if (!$calendrier) {
            return response()->json(['message' => 'Calendrier non trouvé'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $calendrier->update($request->only('nom'));
        return response()->json($calendrier);
    }

    public function destroy($id)
    {
        $calendrier = Calendrie::find($id);
        if (!$calendrier) {
            return response()->json(['message' => 'Calendrier non trouvé'], 404);
        }

        $calendrier->delete();
        return response()->json(null, 204);
    }
}
