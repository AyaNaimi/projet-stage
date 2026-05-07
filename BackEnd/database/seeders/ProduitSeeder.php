<?php

namespace Database\Seeders;

use App\Models\Calibre;
use App\Models\categorie;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->error('No user found. Please seed users first.');
            return;
        }

        $families = [
            'Oeuf de consommation' => [
                'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=Oeuf',
                'types' => [
                    ['name' => 'Oeuf calibre 53-55', 'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=53-55'],
                    ['name' => 'Oeuf calibre 55-57', 'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=55-57'],
                    ['name' => 'Oeuf calibre 57-60', 'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=57-60'],
                    ['name' => 'Oeuf calibre 60-63', 'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=60-63'],
                    ['name' => 'Oeuf calibre 63-65', 'logo' => 'https://via.placeholder.com/100/FF6347/FFFFFF?text=63-65'],
                ],
            ],
            'Ovoproduits' => [
                'logo' => 'https://via.placeholder.com/100/4682B4/FFFFFF?text=Ovo',
                'types' => [
                    ['name' => 'Oeuf liquide entier', 'logo' => 'https://via.placeholder.com/100/4682B4/FFFFFF?text=Liquide'],
                    ['name' => 'Blanc d\'oeuf pasteurisé', 'logo' => 'https://via.placeholder.com/100/4682B4/FFFFFF?text=Blanc'],
                    ['name' => 'Jaune d\'oeuf pasteurisé', 'logo' => 'https://via.placeholder.com/100/4682B4/FFFFFF?text=Jaune'],
                ],
            ],
            'Matière première' => [
                'logo' => 'https://via.placeholder.com/100/2E8B57/FFFFFF?text=MP',
                'types' => [
                    ['name' => 'Aliment volaille', 'logo' => 'https://via.placeholder.com/100/2E8B57/FFFFFF?text=Aliment'],
                    ['name' => 'Additifs nutritionnels', 'logo' => 'https://via.placeholder.com/100/2E8B57/FFFFFF?text=Additif'],
                    ['name' => 'Emballage carton', 'logo' => 'https://via.placeholder.com/100/2E8B57/FFFFFF?text=Carton'],
                    ['name' => 'Emballage plastique', 'logo' => 'https://via.placeholder.com/100/2E8B57/FFFFFF?text=Plastique'],
                ],
            ],
        ];

        $categoryMap = [];

        foreach ($families as $familyName => $data) {
            $family = categorie::firstOrCreate(
                ['categorie' => $familyName, 'idCatMer' => null],
                ['logoP' => $data['logo']]
            );
            $categoryMap[$familyName] = $family;

            foreach ($data['types'] as $typeData) {
                categorie::firstOrCreate(
                    ['categorie' => $typeData['name'], 'idCatMer' => $family->id],
                    ['logoP' => $typeData['logo']]
                );
            }
        }

        $calibreSmall = Calibre::firstOrCreate(['calibre' => 'Petit']);
        $calibreMedium = Calibre::firstOrCreate(['calibre' => 'Moyen']);
        $calibreLarge = Calibre::firstOrCreate(['calibre' => 'Grand']);

        $typeQuantites = ['kg', 'litre', 'unite'];
        $marques = ['Ovotec', 'Ovotec Bio', 'Ovotec Premium'];
        $etats = ['Neuf', 'Bon', 'Moyen'];
        $unites = ['unité', 'plateau', 'carton', 'litre', 'kg', 'sachet'];

        $produits = [
            [
                'Code_produit' => 'PRD-001',
                'designation' => 'Oeuf calibre 53-55 (Standard)',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '500',
                'stock_initial' => '5000',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 1.20,
                'categorie_id' => $categoryMap['Oeuf de consommation']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf calibre 53-55')->first()?->id,
                'calibre_id' => $calibreSmall->id,
            ],
            [
                'Code_produit' => 'PRD-002',
                'designation' => 'Oeuf calibre 57-60 (Standard)',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '500',
                'stock_initial' => '4500',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 1.35,
                'categorie_id' => $categoryMap['Oeuf de consommation']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf calibre 57-60')->first()?->id,
                'calibre_id' => $calibreMedium->id,
            ],
            [
                'Code_produit' => 'PRD-003',
                'designation' => 'Oeuf calibre 63-65 (Premium)',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '300',
                'stock_initial' => '3000',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec Premium',
                'prix_vente' => 1.50,
                'categorie_id' => $categoryMap['Oeuf de consommation']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf calibre 63-65')->first()?->id,
                'calibre_id' => $calibreLarge->id,
            ],
            [
                'Code_produit' => 'PRD-004',
                'designation' => 'Oeuf liquide entier pasteurisé',
                'type_quantite' => 'litre',
                'unite' => 'litre',
                'seuil_alerte' => '50',
                'stock_initial' => '500',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 15.00,
                'categorie_id' => $categoryMap['Ovoproduits']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf liquide entier')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-005',
                'designation' => 'Blanc d\'oeuf pasteurisé 5L',
                'type_quantite' => 'litre',
                'unite' => 'litre',
                'seuil_alerte' => '30',
                'stock_initial' => '300',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 18.00,
                'categorie_id' => $categoryMap['Ovoproduits']->id,
                'suCat_id' => categorie::where('categorie', 'Blanc d\'oeuf pasteurisé')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-006',
                'designation' => 'Jaune d\'oeuf pasteurisé 5L',
                'type_quantite' => 'litre',
                'unite' => 'litre',
                'seuil_alerte' => '30',
                'stock_initial' => '250',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 20.00,
                'categorie_id' => $categoryMap['Ovoproduits']->id,
                'suCat_id' => categorie::where('categorie', 'Jaune d\'oeuf pasteurisé')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-007',
                'designation' => 'Aliment volaille croissance 25kg',
                'type_quantite' => 'kg',
                'unite' => 'sachet',
                'seuil_alerte' => '100',
                'stock_initial' => '1000',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec Bio',
                'prix_vente' => 185.00,
                'categorie_id' => $categoryMap['Matière première']->id,
                'suCat_id' => categorie::where('categorie', 'Aliment volaille')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-008',
                'designation' => 'Additif nutritionnel Vitamines 1kg',
                'type_quantite' => 'kg',
                'unite' => 'kg',
                'seuil_alerte' => '20',
                'stock_initial' => '200',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec Bio',
                'prix_vente' => 450.00,
                'categorie_id' => $categoryMap['Matière première']->id,
                'suCat_id' => categorie::where('categorie', 'Additifs nutritionnels')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-009',
                'designation' => 'Emballage carton 30 oeufs',
                'type_quantite' => 'unite',
                'unite' => 'carton',
                'seuil_alerte' => '200',
                'stock_initial' => '2000',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 2.50,
                'categorie_id' => $categoryMap['Matière première']->id,
                'suCat_id' => categorie::where('categorie', 'Emballage carton')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-010',
                'designation' => 'Film plastique alimentaire 500m',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '50',
                'stock_initial' => '500',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 85.00,
                'categorie_id' => $categoryMap['Matière première']->id,
                'suCat_id' => categorie::where('categorie', 'Emballage plastique')->first()?->id,
                'calibre_id' => null,
            ],
            [
                'Code_produit' => 'PRD-011',
                'designation' => 'Oeuf calibre 55-57 (Standard)',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '500',
                'stock_initial' => '4800',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec',
                'prix_vente' => 1.25,
                'categorie_id' => $categoryMap['Oeuf de consommation']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf calibre 55-57')->first()?->id,
                'calibre_id' => $calibreSmall->id,
            ],
            [
                'Code_produit' => 'PRD-012',
                'designation' => 'Oeuf calibre 60-63 (Premium)',
                'type_quantite' => 'unite',
                'unite' => 'unité',
                'seuil_alerte' => '400',
                'stock_initial' => '3500',
                'etat_produit' => 'Neuf',
                'marque' => 'Ovotec Premium',
                'prix_vente' => 1.45,
                'categorie_id' => $categoryMap['Oeuf de consommation']->id,
                'suCat_id' => categorie::where('categorie', 'Oeuf calibre 60-63')->first()?->id,
                'calibre_id' => $calibreLarge->id,
            ],
        ];

        foreach ($produits as $produitData) {
            Produit::updateOrCreate(
                ['Code_produit' => $produitData['Code_produit']],
                array_merge($produitData, [
                    'user_id' => $user->id,
                    'genre' => null,
                    'tva' => null,
                ])
            );
        }

        $this->command->info(
            sprintf(
                'Seeded %d products with %d families and %d types.',
                count($produits),
                count($families),
                collect($families)->sum(fn($f) => count($f['types']))
            )
        );
    }
}
