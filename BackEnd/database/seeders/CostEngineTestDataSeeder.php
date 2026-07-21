<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\MatierePremiere;
use App\Models\Recette;
use App\Models\ChargeIndirecte;

/**
 * CostEngineTestDataSeeder — Données de test réalistes pour le moteur de coût de revient
 *
 * Scénario : usine agroalimentaire marocaine (biscuiterie)
 * - 3 catégories de produits
 * - 6 matières premières avec prix réalistes (DH)
 * - 6 produits finis (biscuits, gâteaux, etc.) avec recettes complètes
 * - 2 produits packaging (étiquette, emballage)
 * - 4 charges indirectes (loyer, électricité, maintenance, assurance)
 *
 * Couvre les 3 méthodes de répartition : quantité, volume, temps_machine
 */
class CostEngineTestDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🏭 Seeding CostEngine test data...');

        // ── 1. Utilisateur de test ────────────────────────────────────────
        $user = User::firstOrCreate(
            ['email' => 'usine@demo.ma'],
            [
                'name'     => 'Admin Usine',
                'password' => bcrypt('password'),
            ]
        );

        // ── 2. Catégories ────────────────────────────────────────────────
        $catBiscuits = Categorie::firstOrCreate(
            ['categorie' => 'Biscuits'],
            ['logoP'     => 'biscuits.png', 'idCatMer' => 0]
        );
        $catGateaux = Categorie::firstOrCreate(
            ['categorie' => 'Gateaux'],
            ['logoP'     => 'gateaux.png', 'idCatMer' => 0]
        );
        $catBoissons = Categorie::firstOrCreate(
            ['categorie' => 'Boissons'],
            ['logoP'     => 'boissons.png', 'idCatMer' => 0]
        );

        // ── 3. Matières premières ─────────────────────────────────────────
        $mpData = [
            ['nom' => 'Farine de blé',       'prix_achat' => 4.50,  'unite' => 'KG'],
            ['nom' => 'Sucre en poudre',     'prix_achat' => 6.80,  'unite' => 'KG'],
            ['nom' => 'Beurre',              'prix_achat' => 28.00, 'unite' => 'KG'],
            ['nom' => 'Œufs frais',          'prix_achat' => 1.20,  'unite' => 'U'],
            ['nom' => 'Chocolat noir',       'prix_achat' => 42.00, 'unite' => 'KG'],
            ['nom' => 'Lait en poudre',      'prix_achat' => 32.00, 'unite' => 'KG'],
            ['nom' => 'Huile végétale',      'prix_achat' => 12.50, 'unite' => 'L'],
            ['nom' => 'Levure chimique',     'prix_achat' => 18.00, 'unite' => 'KG'],
            ['nom' => 'Vanilline',           'prix_achat' => 85.00, 'unite' => 'KG'],
            ['nom' => 'Sirop de glucose',    'prix_achat' => 9.50,  'unite' => 'KG'],
        ];

        $matieres = [];
        foreach ($mpData as $data) {
            $matieres[$data['nom']] = MatierePremiere::firstOrCreate(
                ['nom' => $data['nom']],
                $data
            );
        }

        // ── 4. Produits packaging (étiquettes & emballages) ──────────────
        $etiquette = Produit::firstOrCreate(
            ['Code_produit' => 'PKG-ETQ-001'],
            [
                'designation'  => 'Étiquette standard 100g',
                'type_quantite'=> 'U',
                'unite'        => 'U',
                'prix_vente'   => 0.15,
                'user_id'      => $user->id,
                'categorie_id' => $catBiscuits->id,
                'tva'          => '20',
            ]
        );

        $emballagePrimaire = Produit::firstOrCreate(
            ['Code_produit' => 'PKG-EMP-001'],
            [
                'designation'  => 'Barquette plastique 100g',
                'type_quantite'=> 'U',
                'unite'        => 'U',
                'prix_vente'   => 0.35,
                'user_id'      => $user->id,
                'categorie_id' => $catBiscuits->id,
                'tva'          => '20',
            ]
        );

        $emballageSecondaire = Produit::firstOrCreate(
            ['Code_produit' => 'PKG-EMS-001'],
            [
                'designation'  => 'Carton d\'expédition 12 unités',
                'type_quantite'=> 'U',
                'unite'        => 'U',
                'prix_vente'   => 1.20,
                'user_id'      => $user->id,
                'categorie_id' => $catBiscuits->id,
                'tva'          => '20',
            ]
        );

        // ── 5. Produits finis ─────────────────────────────────────────────
        $produitsData = [
            [
                'Code_produit'                 => 'BIS-001',
                'designation'                  => 'Petit Beurre Classique',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catBiscuits->id,
                'prix_vente'                   => 45.00,
                'grammage'                     => 100.0,
                'temps_production'             => 25.0,   // minutes
                'cout_horaire_mod'             => 45.00,  // DH/h
                'quantite_production_mensuelle' => 15000,
                'temps_machine'                => 8.0,    // minutes
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => $emballageSecondaire->id,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
            [
                'Code_produit'                 => 'BIS-002',
                'designation'                  => 'Biscuit au Chocolat',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catBiscuits->id,
                'prix_vente'                   => 62.00,
                'grammage'                     => 120.0,
                'temps_production'             => 35.0,
                'cout_horaire_mod'             => 45.00,
                'quantite_production_mensuelle' => 10000,
                'temps_machine'                => 12.0,
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => $emballageSecondaire->id,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
            [
                'Code_produit'                 => 'GAT-001',
                'designation'                  => 'Gâteau au Beurre',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catGateaux->id,
                'prix_vente'                   => 85.00,
                'grammage'                     => 250.0,
                'temps_production'             => 45.0,
                'cout_horaire_mod'             => 50.00,
                'quantite_production_mensuelle' => 5000,
                'temps_machine'                => 15.0,
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => null,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
            [
                'Code_produit'                 => 'GAT-002',
                'designation'                  => 'Brownie Chocolat',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catGateaux->id,
                'prix_vente'                   => 95.00,
                'grammage'                     => 200.0,
                'temps_production'             => 40.0,
                'cout_horaire_mod'             => 50.00,
                'quantite_production_mensuelle' => 3000,
                'temps_machine'                => 10.0,
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => null,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
            [
                'Code_produit'                 => 'BIS-003',
                'designation'                  => 'Sablé Vanille',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catBiscuits->id,
                'prix_vente'                   => 55.00,
                'grammage'                     => 150.0,
                'temps_production'             => 30.0,
                'cout_horaire_mod'             => 45.00,
                'quantite_production_mensuelle' => 8000,
                'temps_machine'                => 10.0,
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => $emballageSecondaire->id,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
            [
                'Code_produit'                 => 'GAT-003',
                'designation'                  => 'Cookie Pépites Chocolat',
                'type_quantite'                => 'K',
                'unite'                        => 'KG',
                'categorie_id'                 => $catGateaux->id,
                'prix_vente'                   => 72.00,
                'grammage'                     => 180.0,
                'temps_production'             => 28.0,
                'cout_horaire_mod'             => 48.00,
                'quantite_production_mensuelle' => 6000,
                'temps_machine'                => 9.0,
                'produit_Etiq_id'              => $etiquette->id,
                'produit_Embalg_id'            => $emballagePrimaire->id,
                'produit_Embalg_S_id'          => null,
                'user_id'                      => $user->id,
                'tva'                          => '20',
            ],
        ];

        $produits = [];
        foreach ($produitsData as $data) {
            $produits[$data['Code_produit']] = Produit::firstOrCreate(
                ['Code_produit' => $data['Code_produit']],
                $data
            );
        }

        // ── 6. Recettes (fiches techniques) ───────────────────────────────
        $recettesData = [
            // ── Petit Beurre Classique ──
            'BIS-001' => [
                ['matiere' => 'Farine de blé',   'quantite' => 0.45,  'perte' => 2.0,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre', 'quantite' => 0.18,  'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',          'quantite' => 0.12,  'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',      'quantite' => 0.50,  'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Levure chimique',  'quantite' => 0.005, 'perte' => 0.0,  'unite' => 'KG'],
                ['matiere' => 'Vanilline',        'quantite' => 0.002, 'perte' => 0.0,  'unite' => 'KG'],
            ],
            // ── Biscuit au Chocolat ──
            'BIS-002' => [
                ['matiere' => 'Farine de blé',   'quantite' => 0.40,  'perte' => 2.0,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre', 'quantite' => 0.20,  'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',          'quantite' => 0.15,  'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Chocolat noir',   'quantite' => 0.12,  'perte' => 1.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',      'quantite' => 0.40,  'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Lait en poudre',  'quantite' => 0.05,  'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Vanilline',        'quantite' => 0.002, 'perte' => 0.0,  'unite' => 'KG'],
            ],
            // ── Gâteau au Beurre ──
            'GAT-001' => [
                ['matiere' => 'Farine de blé',    'quantite' => 0.35, 'perte' => 1.5,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre',  'quantite' => 0.25, 'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',           'quantite' => 0.20, 'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',       'quantite' => 1.00, 'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Lait en poudre',   'quantite' => 0.08, 'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Levure chimique',   'quantite' => 0.01, 'perte' => 0.0,  'unite' => 'KG'],
                ['matiere' => 'Vanilline',         'quantite' => 0.003,'perte' => 0.0,  'unite' => 'KG'],
            ],
            // ── Brownie Chocolat ──
            'GAT-002' => [
                ['matiere' => 'Farine de blé',    'quantite' => 0.25, 'perte' => 1.5,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre',  'quantite' => 0.30, 'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',           'quantite' => 0.18, 'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Chocolat noir',    'quantite' => 0.20, 'perte' => 1.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',       'quantite' => 0.80, 'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Huile végétale',   'quantite' => 0.05, 'perte' => 0.5,  'unite' => 'L'],
            ],
            // ── Sablé Vanille ──
            'BIS-003' => [
                ['matiere' => 'Farine de blé',    'quantite' => 0.50, 'perte' => 2.0,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre',  'quantite' => 0.15, 'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',           'quantite' => 0.25, 'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',       'quantite' => 0.30, 'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Vanilline',         'quantite' => 0.005,'perte' => 0.0,  'unite' => 'KG'],
                ['matiere' => 'Levure chimique',   'quantite' => 0.003,'perte' => 0.0,  'unite' => 'KG'],
            ],
            // ── Cookie Pépites Chocolat ──
            'GAT-003' => [
                ['matiere' => 'Farine de blé',    'quantite' => 0.42, 'perte' => 2.0,  'unite' => 'KG'],
                ['matiere' => 'Sucre en poudre',  'quantite' => 0.22, 'perte' => 1.0,  'unite' => 'KG'],
                ['matiere' => 'Beurre',           'quantite' => 0.18, 'perte' => 0.5,  'unite' => 'KG'],
                ['matiere' => 'Chocolat noir',    'quantite' => 0.15, 'perte' => 1.5,  'unite' => 'KG'],
                ['matiere' => 'Œufs frais',       'quantite' => 0.40, 'perte' => 5.0,  'unite' => 'U'],
                ['matiere' => 'Sirop de glucose',  'quantite' => 0.03, 'perte' => 0.0,  'unite' => 'KG'],
                ['matiere' => 'Levure chimique',   'quantite' => 0.005,'perte' => 0.0,  'unite' => 'KG'],
            ],
        ];

        foreach ($recettesData as $codeProduit => $lignes) {
            $produit = $produits[$codeProduit];
            foreach ($lignes as $ligne) {
                Recette::firstOrCreate(
                    [
                        'produit_id'         => $produit->id,
                        'matiere_premiere_id' => $matieres[$ligne['matiere']]->id,
                    ],
                    [
                        'quantite' => $ligne['quantite'],
                        'perte'    => $ligne['perte'],
                        'unite'    => $ligne['unite'],
                    ]
                );
            }
        }

        // ── 7. Charges indirectes ─────────────────────────────────────────
        $chargesData = [
            [
                'nom'                 => 'Loyer atelier',
                'montant'             => 15000.00,
                'frequence'           => 'mensuel',
                'methode_repartition' => 'volume',
            ],
            [
                'nom'                 => 'Électricité',
                'montant'             => 36000.00,
                'frequence'           => 'annuel',
                'methode_repartition' => 'temps_machine',
            ],
            [
                'nom'                 => 'Maintenance machines',
                'montant'             => 24000.00,
                'frequence'           => 'annuel',
                'methode_repartition' => 'temps_machine',
            ],
            [
                'nom'                 => 'Assurance atelier',
                'montant'             => 18000.00,
                'frequence'           => 'annuel',
                'methode_repartition' => 'quantite',
            ],
        ];

        foreach ($chargesData as $data) {
            ChargeIndirecte::firstOrCreate(
                ['nom' => $data['nom']],
                $data
            );
        }

        // ── Résumé ────────────────────────────────────────────────────────
        $nbProduits     = Produit::count();
        $nbMatieres     = MatierePremiere::count();
        $nbRecettes     = Recette::count();
        $nbCharges      = ChargeIndirecte::count();

        $this->command->info("✅ CostEngine data seeded:");
        $this->command->info("   - {$nbMatieres} matières premières");
        $this->command->info("   - {$nbProduits} produits (dont 3 packaging)");
        $this->command->info("   - {$nbRecettes} lignes de recette");
        $this->command->info("   - {$nbCharges} charges indirectes");
        $this->command->info("");
        $this->command->info("🧪 Test endpoints:");
        $this->command->info("   GET  /api/cout-produits");
        $this->command->info("   GET  /api/produits/{id}/cout-unitaire");
        $this->command->info("   GET  /api/produits/{id}/cout-lot?quantite=100");
        $this->command->info("   POST /api/produits/{id}/simuler-cout");
        $this->command->info("   POST /api/produits/{id}/pricing");
    }
}
