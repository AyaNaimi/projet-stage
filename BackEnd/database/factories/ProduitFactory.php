<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produit>
 */
class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition(): array
    {
        return [
            'Code_produit'                  => strtoupper($this->faker->bothify('P###')),
            'designation'                   => $this->faker->words(3, true),
            'type_quantite'                 => 'K',
            'unite'                         => 'KG',
            'seuil_alerte'                  => 10,
            'stock_initial'                 => 0,
            'etat_produit'                  => 'actif',
            'marque'                        => null,
            'logoP'                         => null,
            'prix_vente'                    => $this->faker->randomFloat(2, 20, 200),
            'user_id'                       => User::factory(),
            'categorie_id'                  => Categorie::factory(),
            'suCat_id'                      => null,
            'calibre_id'                    => null,
            'type'                          => null,
            'genre'                         => null,
            'tva'                           => '20',
            'Dvie'                          => null,
            'reference'                     => null,
            'produit_Etiq_id'               => null,
            'produit_Embalg_id'             => null,
            'produit_Embalg_S_id'           => null,
            'unite_etiquette'               => null,
            'unite_embalage_primaire'       => null,
            'unite_embalage_secondaire'     => null,
            'grammage'                      => $this->faker->randomFloat(1, 50, 500),
            'rendement'                     => 100,
            'temps_production'              => $this->faker->randomFloat(1, 10, 60),
            'cout_horaire_mod'              => $this->faker->randomFloat(2, 20, 80),
            'quantite_production_mensuelle' => $this->faker->numberBetween(100, 2000),
            'temps_machine'                 => $this->faker->randomFloat(1, 5, 30),
        ];
    }
}
