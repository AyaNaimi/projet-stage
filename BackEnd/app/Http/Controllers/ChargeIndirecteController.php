<?php

namespace App\Http\Controllers;

use App\Models\ChargeIndirecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ChargeIndirecteController extends Controller
{
    private const ALLOWED_FREQUENCIES = ['mensuel', 'trimestriel', 'annuel'];

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
            $validator = Validator::make($request->all(), $this->rules());

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            $data['frequence'] = $this->normalizeFrequence($data['frequence']);

            $charge = ChargeIndirecte::create($data);
            return response()->json(['message' => 'Charge indirecte ajoutee', 'data' => $charge], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $charge = ChargeIndirecte::findOrFail($id);

            $validator = Validator::make($request->all(), $this->rules());

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            $data['frequence'] = $this->normalizeFrequence($data['frequence']);

            $charge->update($data);
            return response()->json(['message' => 'Charge indirecte modifiee', 'data' => $charge], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $charge = ChargeIndirecte::findOrFail($id);
            $charge->delete();
            return response()->json(['message' => 'Charge indirecte supprimee'], 200);
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
            return response()->json(['message' => 'Charges indirectes supprimees avec succes'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'min:1', 'max:255'],
            'montant' => ['required', 'numeric', 'min:0'],
            'frequence' => ['required', function ($attribute, $value, $fail) {
                if ($this->isValidFrequence($value)) {
                    return;
                }

                $fail("Le champ $attribute doit etre un nombre entier de mois >= 1 ou une valeur parmi : mensuel, trimestriel, annuel.");
            }],
            'methode_repartition' => ['required', Rule::in(['volume', 'quantite', 'temps_machine'])],
        ];
    }

    private function isValidFrequence(mixed $value): bool
    {
        $normalized = strtolower(trim((string) $value));

        if (in_array($normalized, self::ALLOWED_FREQUENCIES, true)) {
            return true;
        }

        return preg_match('/^\\d+$/', $normalized) === 1 && (int) $normalized >= 1;
    }

    private function normalizeFrequence(mixed $value): string
    {
        $normalized = strtolower(trim((string) $value));

        if (preg_match('/^\\d+$/', $normalized) === 1) {
            return (string) ((int) $normalized);
        }

        return $normalized;
    }
}
