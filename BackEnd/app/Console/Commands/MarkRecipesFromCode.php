<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use App\Models\Produit;

class MarkRecipesFromCode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recipes:mark-from-code';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set is_recette = 1 for produits whose Code_produit starts with REC-';

    public function handle(): int
    {
        if (!Schema::hasColumn('produits', 'Code_produit')) {
            $this->error("Table 'produits' or column 'Code_produit' not found. Aborting.");
            return 1;
        }

        if (!Schema::hasColumn('produits', 'is_recette')) {
            $this->error("Column 'is_recette' does not exist on produits. Run migrations first.");
            return 1;
        }

        $query = Produit::where('Code_produit', 'like', 'REC-%')
            ->where(function ($q) {
                $q->whereNull('is_recette')->orWhere('is_recette', 0);
            });

        $count = $query->count();
        if ($count === 0) {
            $this->info('No produits found with Code_produit starting with REC- that need updating.');
            return 0;
        }

        $updated = $query->update(['is_recette' => 1]);

        $this->info("Updated $updated produits by setting is_recette = 1.");
        return 0;
    }
}
