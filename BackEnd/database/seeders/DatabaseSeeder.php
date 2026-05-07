<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
// use RolesAndPermissionsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(DepartementSeeder::class);

        $this->call([
            RolesAndPermissionsSeeder::class,
            // CrudTestDataSeeder::class, // Disabled: requires equipements table (missing migration)
            ProduitSeeder::class,
            // LivreurSeeder::class, // Disabled: duplicate CIN on re-run
            // VehiculeSeeder::class,
            // VehiculeLivreurSeeder::class,
            // ClientSeeder::class, // Disabled: requires ZoneFactory (missing factory)
            MatierePremiereCategoriesSeeder::class,
        ]);

       
    

    }
}
