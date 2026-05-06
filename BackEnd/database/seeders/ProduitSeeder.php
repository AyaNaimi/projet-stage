<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produit;
use App\Models\Categorie;
use App\Models\Calibre;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have a user
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create some categories
        $cat1 = Categorie::create([
            'categorie' => 'Électronique',
            'logoP' => 'categories/electronics.png',
        ]);

        $cat2 = Categorie::create([
            'categorie' => 'Alimentation',
            'logoP' => 'categories/food.png',
        ]);

        // Create sub-categories
        $subCat1 = Categorie::create([
            'categorie' => 'Smartphones',
            'logoP' => 'categories/smartphones.png',
            'idCatMer' => $cat1->id,
        ]);

        // Create some calibres
        $cal1 = Calibre::create(['calibre' => 'Petit']);
        $cal2 = Calibre::create(['calibre' => 'Moyen']);
        $cal3 = Calibre::create(['calibre' => 'Grand']);

        // Create some products
        Produit::create([
            'Code_produit' => 'PROD001',
            'designation' => 'iPhone 15',
            'type_quantite' => 'unité',
            'unite' => 'pcs',
            'seuil_alerte' => '10',
            'stock_initial' => '50',
            'etat_produit' => 'disponible',
            'marque' => 'Apple',
            'logoP' => 'produits/iphone15.png',
            'prix_vente' => 1200.00,
            'user_id' => $user->id,
            'categorie_id' => $cat1->id,
            'suCat_id' => $subCat1->id,
            'calibre_id' => $cal2->id,
        ]);

        Produit::create([
            'Code_produit' => 'PROD002',
            'designation' => 'Samsung Galaxy S23',
            'type_quantite' => 'unité',
            'unite' => 'pcs',
            'seuil_alerte' => '5',
            'stock_initial' => '30',
            'etat_produit' => 'disponible',
            'marque' => 'Samsung',
            'logoP' => 'produits/s23.png',
            'prix_vente' => 900.00,
            'user_id' => $user->id,
            'categorie_id' => $cat1->id,
            'suCat_id' => $subCat1->id,
            'calibre_id' => $cal2->id,
        ]);

        Produit::create([
            'Code_produit' => 'PROD003',
            'designation' => 'Lait Entier 1L',
            'type_quantite' => 'unité',
            'unite' => 'L',
            'seuil_alerte' => '20',
            'stock_initial' => '100',
            'etat_produit' => 'disponible',
            'marque' => 'Centrale',
            'logoP' => 'produits/lait.png',
            'prix_vente' => 7.00,
            'user_id' => $user->id,
            'categorie_id' => $cat2->id,
            'suCat_id' => null,
            'calibre_id' => $cal1->id,
        ]);

        Produit::create([
            'Code_produit' => 'PROD004',
            'designation' => 'Pain complet',
            'type_quantite' => 'unité',
            'unite' => 'pcs',
            'seuil_alerte' => '15',
            'stock_initial' => '40',
            'etat_produit' => 'disponible',
            'marque' => 'Boulangerie',
            'logoP' => 'produits/pain.png',
            'prix_vente' => 2.50,
            'user_id' => $user->id,
            'categorie_id' => $cat2->id,
            'suCat_id' => null,
            'calibre_id' => $cal3->id,
        ]);
    }
}
