<?php

namespace Database\Factories;

use App\Models\MatierePremiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MatierePremiere>
 */
class MatierePremiereFactory extends Factory
{
    protected $model = MatierePremiere::class;

    public function definition(): array
    {
        return [
            'nom'           => $this->faker->words(2, true),
            'prix_achat'    => $this->faker->randomFloat(2, 1, 50),
            'unite'         => $this->faker->randomElement(['KG', 'L', 'G', 'U']),
            'fournisseur_id'=> null,
            'photo_url'     => null,
            'famille_id'    => null,
            'type_id'       => null,
        ];
    }
}
