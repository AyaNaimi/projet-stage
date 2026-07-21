<?php

namespace App\Http\Controllers\Actifs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    public function index()
    {
        return response()->json(['data' => []]);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function delete($id)
    {
        return response()->json(['message' => 'Not implemented'], 501);
    }
}
