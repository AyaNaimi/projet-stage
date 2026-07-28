<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Categorie>
 */
class CategorieFactory extends Factory
{
    protected $model = Categorie::class;

    public function definition(): array
    {
        return [
            'categorie' => $this->faker->word(),
            'logoP'     => '',   // NOT NULL in migration, use empty string
            'idCatMer'  => null,
        ];
    }
}
