<?php

namespace App\Http\Controllers;

use App\Models\Calibre;
use Illuminate\Http\Request;

class CalibreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $calibres = Calibre::orderBy('id', 'desc')->get();
        return response()->json($calibres);
    }

    public function show($id)
    {
        $calibre = Calibre::find($id);
        return response()->json($calibre);
    }

    public function store(Request $request)
    {
        $calibre = Calibre::create($request->all());
        return response()->json($calibre, 201);
    }

    public function update(Request $request, $id)
    {
        $calibre = Calibre::findOrFail($id);
        $calibre->update($request->all());
        return response()->json($calibre, 200);
    }

    public function destroy($id)
    {
        Calibre::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}