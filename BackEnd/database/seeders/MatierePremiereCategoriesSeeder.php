<?php

namespace Database\Seeders;

use App\Models\FamilleMatiere;
use App\Models\TypeMatiere;
use Illuminate\Database\Seeder;

class MatierePremiereCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $familles = [
            ['nom' => 'Farines'],
            ['nom' => 'Sucres'],
            ['nom' => 'Graisses'],
            ['nom' => 'Arômes'],
        ];

        foreach ($familles as $famille) {
            FamilleMatiere::firstOrCreate(['nom' => $famille['nom']], $famille);
        }

        $types = [
            ['nom' => 'Blé'],
            ['nom' => 'Maïs'],
            ['nom' => 'Liquide'],
            ['nom' => 'Poudre'],
        ];

        foreach ($types as $type) {
            TypeMatiere::firstOrCreate(['nom' => $type['nom']], $type);
        }
    }
}
