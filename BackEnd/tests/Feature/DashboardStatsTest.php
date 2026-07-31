<?php

namespace Tests\Feature;

use App\Models\MatierePremiere;
use App\Models\Produit;
use App\Models\Recette;
use App\Models\User;
use App\Models\categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_returns_real_counts_and_indicators(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'dashboard@example.com',
            'password' => 'secret123',
        ]);

        $category = categorie::create([
            'categorie' => 'Biscuits',
            'logoP' => '',
            'idCatMer' => null,
        ]);

        $matiere = MatierePremiere::create([
            'nom' => 'Farine',
            'prix_achat' => 12.5,
            'unite' => 'kg',
        ]);

        $produit = Produit::create([
            'Code_produit' => 'P-001',
            'designation' => 'Biscuit test',
            'categorie_id' => $category->id,
            'user_id' => $user->id,
            'prix_vente' => 20,
            'quantite_production_mensuelle' => 1000,
            'temps_production' => 30,
            'cout_horaire_mod' => 20,
            'grammage' => 200,
            'rendement' => 95,
            'type_quantite' => 'kg',
            'unite' => 'kg',
        ]);

        Recette::create([
            'produit_id' => $produit->id,
            'matiere_premiere_id' => $matiere->id,
            'quantite' => 0.6,
            'perte' => 5,
            'unite' => 'kg',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard-stats');

        $response->assertOk();
        $response->assertJsonPath('data.counts.total_produits', 1);
        $response->assertJsonPath('data.counts.total_matieres_premieres', 1);
        $response->assertJsonPath('data.counts.total_recettes', 1);
        $response->assertJsonPath('data.counts.total_utilisateurs', 1);
        $response->assertJsonPath('data.indicators.simulations_active', 0);
        $response->assertJsonStructure([
            'data' => [
                'counts',
                'indicators',
                'cost_evolution',
                'product_distribution',
                'recent_activities',
                'warnings',
            ],
        ]);
    }
}
