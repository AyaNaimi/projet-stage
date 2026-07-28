<?php

namespace App\Http\Controllers;

use App\Models\MatierePremiere;
use App\Models\MatierePremiereHistorique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MatierePremiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $matieres = MatierePremiere::with('fournisseur', 'historiques', 'famille', 'type')->orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $matieres
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prix_achat' => 'required|numeric|min:0',
                'unite' => 'required|string',
                'fournisseur_id' => 'nullable|exists:fournisseurs,id',
                'famille_id' => 'nullable|exists:famille_matieres,id',
                'type_id' => 'nullable|exists:type_matieres,id',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            if ($request->hasFile('logoP')) {
                $path = $request->file('logoP')->store('public/matiere_premieres');
                $data['photo_url'] = Storage::url($path);
            }

            $matiere = MatierePremiere::create($data);

            MatierePremiereHistorique::create([
                'matiere_premiere_id' => $matiere->id,
                'prix' => $matiere->prix_achat,
            ]);

            return response()->json([
                'message' => 'Matière première ajoutée avec succès',
                'data' => $matiere->load('fournisseur', 'historiques', 'famille', 'type')
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $matiere = MatierePremiere::with('fournisseur', 'historiques', 'famille', 'type')->findOrFail($id);
            return response()->json(['data' => $matiere], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $matiere = MatierePremiere::findOrFail($id);
            $oldPrice = $matiere->prix_achat;

            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prix_achat' => 'required|numeric|min:0',
                'unite' => 'required|string',
                'fournisseur_id' => 'nullable|exists:fournisseurs,id',
                'famille_id' => 'nullable|exists:famille_matieres,id',
                'type_id' => 'nullable|exists:type_matieres,id',
                'logoP' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            if ($request->hasFile('logoP')) {
                if ($matiere->photo_url) {
                    $oldPath = str_replace('/storage', 'public', $matiere->photo_url);
                    Storage::delete($oldPath);
                }
                $path = $request->file('logoP')->store('public/matiere_premieres');
                $data['photo_url'] = Storage::url($path);
            }

            $matiere->update($data);

            if ($oldPrice != $matiere->prix_achat) {
                MatierePremiereHistorique::create([
                    'matiere_premiere_id' => $matiere->id,
                    'prix' => $matiere->prix_achat,
                ]);
            }

            return response()->json([
                'message' => 'Matière première modifiée avec succès',
                'data' => $matiere->load('fournisseur', 'historiques', 'famille', 'type')
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $matiere = MatierePremiere::findOrFail($id);
            $matiere->delete();

            return response()->json(['message' => 'Matière première supprimée avec succès'], 200);
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
            MatierePremiere::whereIn('id', $ids)->delete();
            return response()->json(['message' => 'Matières premières supprimées avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get price at a specific date for a matiere premiere
     */
    public function priceAt(Request $request, $id)
    {
        try {
            $date = $request->query('date');
            if (!$date) {
                $date = now()->toDateString();
            }

            $historique = MatierePremiereHistorique::where('matiere_premiere_id', $id)
                ->whereDate('created_at', '<=', $date)
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$historique) {
                return response()->json(['message' => 'Aucun historique trouvé pour la date fournie'], 404);
            }

            return response()->json(['prix' => $historique->prix, 'date' => $historique->created_at], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Import matières premières depuis un fichier CSV
     * Expected CSV headers: nom,prix_achat,unite,fournisseur
     */
    public function importCsv(Request $request)
    {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['message' => 'Fichier CSV manquant'], 400);
            }

            $file = $request->file('file');
            $path = $file->getRealPath();
            $handle = fopen($path, 'r');
            if ($handle === false) {
                return response()->json(['message' => 'Impossible d\'ouvrir le fichier'], 500);
            }

            $header = null;
            $imported = 0;
            $updated = 0;
            $skippedRows = [];

            // build existing map of normalized names to models to avoid DB lookup per row
            $existingMatieres = MatierePremiere::all();
            $normalizedMap = [];
            foreach ($existingMatieres as $em) {
                $normalizedMap[$this->normalizeString($em->nom)] = $em;
            }

            $lineNumber = 0;
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $lineNumber++;
                if (!$header) {
                    $header = array_map('trim', $row);
                    continue;
                }
                $data = array_combine($header, $row);
                if (!$data) {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Ligne vide ou en-têtes incorrectes'];
                    continue;
                }

                $nom = isset($data['nom']) ? trim($data['nom']) : null;
                if (!$nom) {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Champ nom manquant'];
                    continue;
                }

                $prix = null;
                if (isset($data['prix_achat']) && $data['prix_achat'] !== '') {
                    $prix = floatval(str_replace(',', '.', $data['prix_achat']));
                } else {
                    $skippedRows[] = ['line' => $lineNumber + 1, 'raw' => implode(',', $row), 'reason' => 'Champ prix_achat manquant'];
                    continue;
                }

                $unite = $data['unite'] ?? null;
                $fournisseurName = $data['fournisseur'] ?? null;

                $normalizedName = $this->normalizeString($nom);

                $fournisseurId = null;
                if ($fournisseurName) {
                    // Ensure required CodeFournisseur is provided when creating a Fournisseur
                    $user = \App\Models\User::first();
                    $userId = $user ? $user->id : null;
                    $generatedCode = 'CF-' . substr(md5($fournisseurName . time()), 0, 8);
                    $f = \App\Models\Fournisseur::firstOrCreate(
                        ['nom' => $fournisseurName],
                        [
                            'CodeFournisseur' => $generatedCode,
                            'raison_sociale' => $fournisseurName,
                            'adresse' => '-',
                            'tele' => '-',
                            'ville' => '-',
                            'abreviation' => '-',
                            'code_postal' => '-',
                            'email' => '-',
                            'ice' => 0,
                            'user_id' => $userId,
                        ]
                    );
                    $fournisseurId = $f->id;
                }

                $matiere = null;
                if (isset($normalizedMap[$normalizedName])) {
                    $matiere = $normalizedMap[$normalizedName];
                } else {
                    // fallback: case-insensitive exact name match
                    $matiere = MatierePremiere::whereRaw('LOWER(nom) = ?', [strtolower($nom)])->first();
                }

                if ($matiere) {
                    $oldPrice = $matiere->prix_achat;
                    $matiere->update([
                        'prix_achat' => $prix,
                        'unite' => $unite,
                        'fournisseur_id' => $fournisseurId,
                    ]);
                    // update map
                    $normalizedMap[$this->normalizeString($matiere->nom)] = $matiere;
                    if ($oldPrice != $prix) {
                        MatierePremiereHistorique::create([
                            'matiere_premiere_id' => $matiere->id,
                            'prix' => $prix,
                        ]);
                    }
                    $updated++;
                } else {
                    $matiere = MatierePremiere::create([
                        'nom' => $nom,
                        'prix_achat' => $prix,
                        'unite' => $unite,
                        'fournisseur_id' => $fournisseurId,
                    ]);
                    // add to normalized map
                    $normalizedMap[$this->normalizeString($matiere->nom)] = $matiere;
                    MatierePremiereHistorique::create([
                        'matiere_premiere_id' => $matiere->id,
                        'prix' => $prix,
                    ]);
                    $imported++;
                }
            }
            fclose($handle);

            $response = ['imported' => $imported, 'updated' => $updated];

            // if there are skipped rows, store a CSV log
            if (!empty($skippedRows)) {
                $logHeader = ['line', 'raw', 'reason'];
                $csvLines = [];
                $csvLines[] = implode(',', $logHeader);
                foreach ($skippedRows as $r) {
                    $csvLines[] = sprintf('"%s","%s","%s"', $r['line'], str_replace('"', '""', $r['raw']), str_replace('"', '""', $r['reason']));
                }
                $content = implode("\n", $csvLines);
                $fileName = 'import_logs/matiere_import_' . now()->format('Ymd_His') . '.csv';
                Storage::put('public/' . $fileName, $content);
                $response['log_url'] = Storage::url('public/' . $fileName);
                $response['skipped'] = count($skippedRows);
            }

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function normalizeString($str)
    {
        $s = trim($str);
        // transliterate accents
        $s = iconv('UTF-8', 'ASCII//TRANSLIT', $s);
        $s = preg_replace('/[^A-Za-z0-9 ]/', '', $s);
        $s = strtolower($s);
        $s = preg_replace('/\s+/', ' ', $s);
        return $s;
    }
}
