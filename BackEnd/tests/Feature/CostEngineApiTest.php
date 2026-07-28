<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Produit;
use App\Models\MatierePremiere;
use App\Models\Recette;
use App\Models\ChargeIndirecte;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Tests Feature du moteur de calcul (CostEngine)
 *
 * Valide les endpoints API avec une vraie base de données de test.
 * Chaque test crée ses propres données et vérifie la cohérence des résultats
 * avec un calcul manuel de référence.
 *
 * Scénarios :
 *  - API coût unitaire : structure, valeurs
 *  - API coût lot : structure, valeurs scalées
 *  - API batch : plusieurs produits en un appel
 *  - API tableau de bord : pagination, champs marge
 *  - API simulation what-if : override sans persistance
 *  - ChargeIndirecte : création avec fréquence numérique
 *  - ChargeIndirecte : rejet fréquence invalide
 *  - Répartition charges indirectes : méthodes quantité / volume / temps_machine
 */
class CostEngineApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        // Crée un utilisateur et authentifie via Sanctum
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private function creerProduitComplet(array $overrides = []): Produit
    {
        return Produit::factory()->create(array_merge([
            'designation'                  => 'Produit Test',
            'Code_produit'                 => 'PT001',
            'prix_vente'                   => 80.0,
            'temps_production'             => 30.0,   // 30 minutes
            'cout_horaire_mod'             => 60.0,   // 60 DH/h → MOD = 30 DH
            'quantite_production_mensuelle'=> 1000,
            'grammage'                     => 250.0,  // 250 g
            'temps_machine'                => 20.0,
            'produit_Etiq_id'              => null,
            'produit_Embalg_id'            => null,
            'produit_Embalg_S_id'          => null,
        ], $overrides));
    }

    private function creerMatierePremiere(array $attrs = []): MatierePremiere
    {
        return MatierePremiere::factory()->create(array_merge([
            'nom'        => 'Farine',
            'prix_achat' => 5.0,
            'unite'      => 'KG',
        ], $attrs));
    }

    private function creerRecette(Produit $produit, MatierePremiere $mp, float $quantite = 2.0, float $perte = 0.0): Recette
    {
        return Recette::create([
            'produit_id'         => $produit->id,
            'matiere_premiere_id'=> $mp->id,
            'quantite'           => $quantite,
            'perte'              => $perte,
            'unite'              => 'KG',
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Coût unitaire — GET /api/produits/{id}/cout-unitaire
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_unitaire_retourne_structure_correcte(): void
    {
        $produit = $this->creerProduitComplet();

        $response = $this->getJson("/api/produits/{$produit->id}/cout-unitaire");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'produit_id',
                         'designation',
                         'cout_matieres',
                         'cout_mod',
                         'cout_packaging',
                         'cout_charges_indirectes',
                         'cout_unitaire',
                         'detail' => ['matieres', 'mod', 'packaging', 'charges_indirectes'],
                     ],
                 ])
                 ->assertJson(['success' => true]);
    }

    public function test_cout_unitaire_valeurs_coherentes_avec_calcul_manuel(): void
    {
        // Matières : 2 kg × 5 DH sans perte = 10 DH
        // MOD      : 30 min × 60 DH/h       = 30 DH
        // Total    : 40 DH (pas de charges indirectes ni packaging)
        $produit = $this->creerProduitComplet();
        $mp      = $this->creerMatierePremiere(['prix_achat' => 5.0]);
        $this->creerRecette($produit, $mp, 2.0, 0.0);

        $response = $this->getJson("/api/produits/{$produit->id}/cout-unitaire");

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(10.0, $data['cout_matieres'],  'Coût matières incorrect');
        $this->assertEquals(30.0, $data['cout_mod'],       'Coût MOD incorrect');
        $this->assertEquals(0.0,  $data['cout_packaging'], 'Coût packaging incorrect');
        $this->assertEquals(40.0, $data['cout_unitaire'],  'Coût unitaire total incorrect');
    }

    public function test_cout_unitaire_avec_perte_10_pct(): void
    {
        // 2 kg × 5 DH / (1 - 0.10) = 10 / 0.9 ≈ 11.1111
        $produit = $this->creerProduitComplet(['temps_production' => 0, 'cout_horaire_mod' => 0]);
        $mp      = $this->creerMatierePremiere(['prix_achat' => 5.0]);
        $this->creerRecette($produit, $mp, 2.0, 10.0);

        $response = $this->getJson("/api/produits/{$produit->id}/cout-unitaire");

        $response->assertStatus(200);
        $data     = $response->json('data');
        $attendu  = round(10.0 / 0.9, 4);

        $this->assertEquals($attendu, $data['cout_matieres']);
    }

    public function test_cout_unitaire_retourne_404_si_produit_inexistant(): void
    {
        $this->getJson('/api/produits/99999/cout-unitaire')
             ->assertStatus(404);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Coût lot — GET /api/produits/{id}/cout-lot?quantite=N
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_lot_structure_et_valeurs(): void
    {
        // Coût unitaire = 40 DH → lot 100 = 4000 DH
        $produit = $this->creerProduitComplet();
        $mp      = $this->creerMatierePremiere(['prix_achat' => 5.0]);
        $this->creerRecette($produit, $mp, 2.0, 0.0);

        $response = $this->getJson("/api/produits/{$produit->id}/cout-lot?quantite=100");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'quantite_lot',
                         'cout_lot',
                         'cout_matieres_lot',
                         'cout_mod_lot',
                         'cout_packaging_lot',
                         'cout_charges_indirectes_lot',
                     ],
                 ]);

        $data = $response->json('data');
        $this->assertEquals(100,    $data['quantite_lot']);
        $this->assertEquals(4000.0, $data['cout_lot']);
        $this->assertEquals(1000.0, $data['cout_matieres_lot']);
        $this->assertEquals(3000.0, $data['cout_mod_lot']);
    }

    public function test_cout_lot_retourne_422_si_quantite_manquante(): void
    {
        $produit = $this->creerProduitComplet();

        $this->getJson("/api/produits/{$produit->id}/cout-lot")
             ->assertStatus(422);
    }

    public function test_cout_lot_retourne_422_si_quantite_nulle(): void
    {
        $produit = $this->creerProduitComplet();

        $this->getJson("/api/produits/{$produit->id}/cout-lot?quantite=0")
             ->assertStatus(422);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Batch — POST /api/produits/cout-batch
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_batch_retourne_resultats_pour_chaque_produit(): void
    {
        $p1 = $this->creerProduitComplet(['Code_produit' => 'P001']);
        $p2 = $this->creerProduitComplet(['Code_produit' => 'P002']);

        $response = $this->postJson('/api/produits/cout-batch', [
            'ids' => [$p1->id, $p2->id],
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'ids_introuvables',
                 ]);

        $data = $response->json('data');
        $this->assertArrayHasKey($p1->id, $data);
        $this->assertArrayHasKey($p2->id, $data);
    }

    public function test_cout_batch_signale_ids_introuvables(): void
    {
        $produit = $this->creerProduitComplet();

        $response = $this->postJson('/api/produits/cout-batch', [
            'ids' => [$produit->id, 99999],
        ]);

        $response->assertStatus(200);
        $introuvables = $response->json('ids_introuvables');

        $this->assertContains(99999, $introuvables);
    }

    public function test_cout_batch_retourne_422_si_ids_vides(): void
    {
        $this->postJson('/api/produits/cout-batch', ['ids' => []])
             ->assertStatus(422);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Tableau de bord — GET /api/cout-produits
    // ─────────────────────────────────────────────────────────────────────────

    public function test_tableau_de_bord_retourne_liste_paginee(): void
    {
        $this->creerProduitComplet(['Code_produit' => 'TB001']);
        $this->creerProduitComplet(['Code_produit' => 'TB002']);

        $response = $this->getJson('/api/cout-produits');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
                 ]);

        $this->assertTrue($response->json('pagination.total') >= 2);
    }

    public function test_tableau_de_bord_contient_champs_marge(): void
    {
        $this->creerProduitComplet(['prix_vente' => 80.0]);

        $response = $this->getJson('/api/cout-produits');

        $response->assertStatus(200);
        $item = $response->json('data.0');

        $this->assertArrayHasKey('marge',     $item);
        $this->assertArrayHasKey('marge_pct', $item);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Simulation what-if — POST /api/produits/{id}/simuler-cout
    // ─────────────────────────────────────────────────────────────────────────

    public function test_simulation_override_sans_persister(): void
    {
        $produit = $this->creerProduitComplet([
            'temps_production' => 30.0,
            'cout_horaire_mod' => 60.0,
        ]);

        // Simuler avec un taux horaire plus élevé
        $response = $this->postJson("/api/produits/{$produit->id}/simuler-cout", [
            'cout_horaire_mod' => 120.0,   // double du réel
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'simule' => true]);

        $data   = $response->json('data');
        $modSim = $data['cout_mod'];

        // MOD simulé = 30 min × 120 DH/h = 60 DH (double de 30 DH)
        $this->assertEquals(60.0, $modSim);

        // Vérifier que la DB n'a pas changé
        $produit->refresh();
        $this->assertEquals(60.0, $produit->cout_horaire_mod);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. ChargeIndirecte — fréquence numérique
    // ─────────────────────────────────────────────────────────────────────────

    public function test_charge_indirecte_accepte_frequence_numerique(): void
    {
        $response = $this->postJson('/api/charges-indirectes', [
            'nom'                 => 'Électricité',
            'montant'             => 6000.0,
            'frequence'           => 6,          // 6 mois (semestriel)
            'methode_repartition' => 'quantite',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('charges_indirectes', [
            'nom'       => 'Électricité',
            'frequence' => 6,
        ]);
    }

    public function test_charge_indirecte_accepte_frequence_texte_heritee(): void
    {
        $response = $this->postJson('/api/charges-indirectes', [
            'nom'                 => 'Maintenance',
            'montant'             => 12000.0,
            'frequence'           => 'annuel',
            'methode_repartition' => 'temps_machine',
        ]);

        $response->assertStatus(201);
    }

    public function test_charge_indirecte_rejette_frequence_invalide(): void
    {
        $response = $this->postJson('/api/charges-indirectes', [
            'nom'                 => 'Test',
            'montant'             => 100.0,
            'frequence'           => 'invalide_xyz',
            'methode_repartition' => 'quantite',
        ]);

        $response->assertStatus(422)
                 ->assertJsonPath('errors.frequence.0', fn($msg) => str_contains($msg, 'mois'));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Répartition charges indirectes — scénarios manuels
    // ─────────────────────────────────────────────────────────────────────────

    public function test_repartition_par_quantite(): void
    {
        // Charge : 1200 DH / mois, méthode quantité
        // Produit A : 300 unités/mois  → part = 300/500 = 0.6
        // Produit B : 200 unités/mois  → part = 200/500 = 0.4
        // Coût alloué A = 1200 × 0.6 = 720 DH/mois
        // Coût unitaire A = 720 / 300 = 2.40 DH
        ChargeIndirecte::create([
            'nom'                 => 'Loyer',
            'montant'             => 1200.0,
            'frequence'           => 1,
            'methode_repartition' => 'quantite',
        ]);

        $produitA = $this->creerProduitComplet([
            'Code_produit'                  => 'A',
            'quantite_production_mensuelle' => 300,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);
        // Produit B crée la base totale
        $this->creerProduitComplet([
            'Code_produit'                  => 'B',
            'quantite_production_mensuelle' => 200,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);

        $response = $this->getJson("/api/produits/{$produitA->id}/cout-unitaire");
        $response->assertStatus(200);

        $chargesUnitaires = $response->json('data.cout_charges_indirectes');

        // Tolérance de 0.001 DH
        $this->assertEqualsWithDelta(2.40, $chargesUnitaires, 0.001,
            "Répartition quantité incorrecte. Attendu ≈2.40 DH, obtenu {$chargesUnitaires}");
    }

    public function test_repartition_par_temps_machine(): void
    {
        // Charge : 600 DH / mois, méthode temps_machine
        // Produit A : 20 min machine, 500 unités/mois
        // Produit B : 10 min machine, 500 unités/mois
        // Base totale = 30 min  → part A = 20/30 = 0.6667
        // Coût alloué A = 600 × (20/30) = 400 DH/mois
        // Coût unitaire A = 400 / 500 = 0.80 DH
        ChargeIndirecte::create([
            'nom'                 => 'Amortissement machine',
            'montant'             => 600.0,
            'frequence'           => 1,
            'methode_repartition' => 'temps_machine',
        ]);

        $produitA = $this->creerProduitComplet([
            'Code_produit'                  => 'MA',
            'quantite_production_mensuelle' => 500,
            'temps_machine'                 => 20.0,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);
        $this->creerProduitComplet([
            'Code_produit'                  => 'MB',
            'quantite_production_mensuelle' => 500,
            'temps_machine'                 => 10.0,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);

        $response = $this->getJson("/api/produits/{$produitA->id}/cout-unitaire");
        $response->assertStatus(200);

        $chargesUnitaires = $response->json('data.cout_charges_indirectes');

        $this->assertEqualsWithDelta(0.80, $chargesUnitaires, 0.001,
            "Répartition temps_machine incorrecte. Attendu ≈0.80 DH, obtenu {$chargesUnitaires}");
    }

    public function test_charges_indirectes_nul_si_quantite_mensuelle_non_definie(): void
    {
        ChargeIndirecte::create([
            'nom'                 => 'Eau',
            'montant'             => 500.0,
            'frequence'           => 1,
            'methode_repartition' => 'quantite',
        ]);

        $produit = $this->creerProduitComplet([
            'quantite_production_mensuelle' => null,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);

        $response = $this->getJson("/api/produits/{$produit->id}/cout-unitaire");
        $response->assertStatus(200);

        $this->assertEquals(0.0, $response->json('data.cout_charges_indirectes'));
    }

    public function test_charge_frequence_annuelle_divisee_par_12(): void
    {
        // Charge annuelle : 12000 DH → mensuelle = 1000 DH
        // Un seul produit : 500 unités/mois
        // Coût unitaire charges = 1000 / 500 = 2 DH
        ChargeIndirecte::create([
            'nom'                 => 'Assurance',
            'montant'             => 12000.0,
            'frequence'           => 12,          // 12 mois = annuel
            'methode_repartition' => 'quantite',
        ]);

        $produit = $this->creerProduitComplet([
            'quantite_production_mensuelle' => 500,
            'temps_production'              => 0,
            'cout_horaire_mod'              => 0,
        ]);

        $response = $this->getJson("/api/produits/{$produit->id}/cout-unitaire");
        $response->assertStatus(200);

        $this->assertEqualsWithDelta(2.0, $response->json('data.cout_charges_indirectes'), 0.001);
    }
}
