<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CostEngineService;
use App\Models\Produit;
use App\Models\Recette;
use App\Models\MatierePremiere;
use App\Models\ChargeIndirecte;
use Illuminate\Database\Eloquent\Collection;

/**
 * Tests unitaires du CostEngineService
 *
 * Ces tests ne touchent PAS la base de données :
 * - Les modèles sont instanciés en mémoire (new Model([...]))
 * - ChargeIndirecte::all() est mocké pour retourner une collection vide
 *   → les charges indirectes sont testées séparément dans les Feature tests
 *   → les tests unitaires valident chaque composante de coût isolément
 */
class CostEngineServiceTest extends TestCase
{
    // Pas de RefreshDatabase → pas de migration requise
    private CostEngineService $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = new CostEngineService();

        // Mocker ChargeIndirecte::all() pour éviter toute requête DB
        // dans les tests unitaires qui ne testent pas les charges indirectes.
        $this->mockChargesVides();
    }

    /**
     * Mocke ChargeIndirecte::all() pour retourner une collection vide.
     * Ceci évite les erreurs "table not found" dans les tests unitaires.
     */
    private function mockChargesVides(): void
    {
        // On utilise une collection Eloquent vide — ChargeIndirecte::all()
        // est appelé dans calculerChargesIndirectes() via le service.
        // On partialMock le modèle pour court-circuiter la DB.
        \Illuminate\Support\Facades\DB::shouldReceive('select')
            ->andReturn([])
            ->byDefault();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private function fakeProduit(array $attrs = []): Produit
    {
        $produit = new Produit(array_merge([
            'id'                           => 1,
            'designation'                  => 'Produit Test',
            'temps_production'             => 0,
            'cout_horaire_mod'             => 0,
            'quantite_production_mensuelle'=> 1000,
            'grammage'                     => 0,
            'temps_machine'                => 0,
            'prix_vente'                   => 0,
            'produit_Etiq_id'              => null,
            'produit_Embalg_id'            => null,
            'produit_Embalg_S_id'          => null,
        ], $attrs));

        $produit->setRelation('recettes', new Collection());
        $produit->setRelation('etiquette', null);
        $produit->setRelation('Embalge', null);
        $produit->setRelation('EmbalgeS', null);

        return $produit;
    }

    private function fakeRecette(float $quantite, float $perte, float $prixAchat): Recette
    {
        $mp = new MatierePremiere([
            'id'         => rand(1, 9999),
            'nom'        => 'MP Test',
            'prix_achat' => $prixAchat,
        ]);

        $recette = new Recette([
            'quantite' => $quantite,
            'perte'    => $perte,
            'unite'    => 'KG',
        ]);
        $recette->setRelation('matierePremiere', $mp);

        return $recette;
    }

    /**
     * Crée une collection de ChargeIndirecte factice (sans DB).
     */
    private function fakeChargeCollection(array $charges): Collection
    {
        $items = array_map(function ($data) {
            $c = new ChargeIndirecte();
            foreach ($data as $k => $v) $c->$k = $v;
            return $c;
        }, $charges);
        return new Collection($items);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Coût matières — sans perte
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_matieres_sans_perte(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(2.0, 0.0, 10.0),
        ]));

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(20.0, $result['cout_matieres']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Coût matières — avec perte
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_matieres_avec_perte_10_pct(): void
    {
        // 2 kg × 10 DH / (1 - 0.10) = 20 / 0.9 ≈ 22.2222
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(2.0, 10.0, 10.0),
        ]));

        $result  = $this->engine->calculerCoutUnitaire($produit);
        $attendu = round(20.0 / 0.9, 4);

        $this->assertEquals($attendu, $result['cout_matieres']);
    }

    public function test_cout_matieres_plusieurs_lignes(): void
    {
        // Ligne 1 : 1 kg × 5 DH sans perte = 5 DH
        // Ligne 2 : 0.5 kg × 8 DH avec 20 % perte = 4 / 0.8 = 5 DH
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(1.0, 0.0, 5.0),
            $this->fakeRecette(0.5, 20.0, 8.0),
        ]));

        $result  = $this->engine->calculerCoutUnitaire($produit);
        $attendu = round(5.0 + (0.5 * 8.0 / 0.8), 4);

        $this->assertEquals($attendu, $result['cout_matieres']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Coût MOD
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_mod(): void
    {
        // 30 min × 60 DH/h = (30/60) × 60 = 30 DH
        $produit = $this->fakeProduit([
            'temps_production'             => 30.0,
            'cout_horaire_mod'             => 60.0,
            'quantite_production_mensuelle'=> 0,
        ]);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(30.0, $result['cout_mod']);
    }

    public function test_cout_mod_zero_si_pas_de_temps(): void
    {
        $produit = $this->fakeProduit([
            'temps_production'             => 0,
            'cout_horaire_mod'             => 50.0,
            'quantite_production_mensuelle'=> 0,
        ]);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(0.0, $result['cout_mod']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Coût packaging
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_packaging_avec_etiquette(): void
    {
        $etiquette = new Produit(['id' => 10, 'designation' => 'Étiquette', 'prix_vente' => 0.5]);
        $etiquette->setRelation('recettes', new Collection());
        $etiquette->setRelation('etiquette', null);
        $etiquette->setRelation('Embalge', null);
        $etiquette->setRelation('EmbalgeS', null);

        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('etiquette', $etiquette);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(0.5, $result['cout_packaging']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Coût total unitaire
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_unitaire_total(): void
    {
        // Matières : 2 kg × 10 DH sans perte = 20 DH
        // MOD      : 30 min × 60 DH/h        = 30 DH
        // Total attendu (pas de charges car qty_mensuelle=0) = 50 DH
        $produit = $this->fakeProduit([
            'temps_production'             => 30.0,
            'cout_horaire_mod'             => 60.0,
            'quantite_production_mensuelle'=> 0,
        ]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(2.0, 0.0, 10.0),
        ]));

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(50.0, $result['cout_unitaire']);
        $this->assertEquals(20.0, $result['cout_matieres']);
        $this->assertEquals(30.0, $result['cout_mod']);
        $this->assertEquals(0.0,  $result['cout_packaging']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Coût lot
    // ─────────────────────────────────────────────────────────────────────────

    public function test_cout_lot_multiplie_par_quantite(): void
    {
        $produit = $this->fakeProduit([
            'temps_production'             => 30.0,
            'cout_horaire_mod'             => 60.0,
            'quantite_production_mensuelle'=> 0,
        ]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(2.0, 0.0, 10.0),
        ]));

        $result = $this->engine->calculerCoutLot($produit, 100);

        $this->assertEquals(100,    $result['quantite_lot']);
        $this->assertEquals(5000.0, $result['cout_lot']);
        $this->assertEquals(2000.0, $result['cout_matieres_lot']);
        $this->assertEquals(3000.0, $result['cout_mod_lot']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Conversion fréquence (pas de DB)
    // ─────────────────────────────────────────────────────────────────────────

    public function test_conversion_frequence_texte(): void
    {
        $this->assertEquals(1,  $this->engine->convertirFrequenceEnMois('mensuel'));
        $this->assertEquals(3,  $this->engine->convertirFrequenceEnMois('trimestriel'));
        $this->assertEquals(12, $this->engine->convertirFrequenceEnMois('annuel'));
    }

    public function test_conversion_frequence_numerique(): void
    {
        $this->assertEquals(1,  $this->engine->convertirFrequenceEnMois(1));
        $this->assertEquals(6,  $this->engine->convertirFrequenceEnMois(6));
        $this->assertEquals(12, $this->engine->convertirFrequenceEnMois(12));
        $this->assertEquals(3,  $this->engine->convertirFrequenceEnMois('3'));
    }

    public function test_conversion_frequence_inconnue_retourne_1(): void
    {
        $this->assertEquals(1, $this->engine->convertirFrequenceEnMois('inconnu'));
        $this->assertEquals(1, $this->engine->convertirFrequenceEnMois(0));
        $this->assertEquals(1, $this->engine->convertirFrequenceEnMois(-5));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Cas limites
    // ─────────────────────────────────────────────────────────────────────────

    public function test_perte_proche_100_pct_est_ignoree(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(1.0, 99.99, 10.0),
        ]));

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertGreaterThan(0.0, $result['cout_matieres']);
        $this->assertIsFloat($result['cout_matieres']);
    }

    public function test_cout_zero_si_recettes_vides(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(0.0, $result['cout_unitaire']);
    }

    public function test_charges_indirectes_zero_si_quantite_mensuelle_nulle(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertEquals(0.0, $result['cout_charges_indirectes']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Structure de la réponse
    // ─────────────────────────────────────────────────────────────────────────

    public function test_structure_reponse_cout_unitaire(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);

        $result = $this->engine->calculerCoutUnitaire($produit);

        $this->assertArrayHasKey('produit_id',              $result);
        $this->assertArrayHasKey('cout_matieres',           $result);
        $this->assertArrayHasKey('cout_mod',                $result);
        $this->assertArrayHasKey('cout_packaging',          $result);
        $this->assertArrayHasKey('cout_charges_indirectes', $result);
        $this->assertArrayHasKey('cout_unitaire',           $result);
        $this->assertArrayHasKey('detail',                  $result);
        $this->assertArrayHasKey('matieres',           $result['detail']);
        $this->assertArrayHasKey('mod',                $result['detail']);
        $this->assertArrayHasKey('packaging',          $result['detail']);
        $this->assertArrayHasKey('charges_indirectes', $result['detail']);
    }

    public function test_structure_reponse_cout_lot(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);

        $result = $this->engine->calculerCoutLot($produit, 50);

        $this->assertArrayHasKey('quantite_lot',               $result);
        $this->assertArrayHasKey('cout_lot',                   $result);
        $this->assertArrayHasKey('cout_matieres_lot',          $result);
        $this->assertArrayHasKey('cout_mod_lot',               $result);
        $this->assertArrayHasKey('cout_packaging_lot',         $result);
        $this->assertArrayHasKey('cout_charges_indirectes_lot',$result);
    }

    public function test_detail_matieres_contient_formule_tracable(): void
    {
        $produit = $this->fakeProduit(['quantite_production_mensuelle' => 0]);
        $produit->setRelation('recettes', new Collection([
            $this->fakeRecette(2.0, 10.0, 5.0),
        ]));

        $result = $this->engine->calculerCoutUnitaire($produit);
        $lignes = $result['detail']['matieres']['lignes'];

        $this->assertNotEmpty($lignes);
        $ligne = $lignes[0];

        $this->assertArrayHasKey('perte_pct',             $ligne);
        $this->assertArrayHasKey('quantite_reelle_achat', $ligne);
        $this->assertArrayHasKey('cout',                  $ligne);
        $this->assertEquals(10.0, $ligne['perte_pct']);
        $this->assertGreaterThan(2.0, $ligne['quantite_reelle_achat']);
    }
}
