<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use App\Models\Produit;

class MarkSpecificRecettes extends Command
{
    protected $signature = 'recipes:mark-specific {--ids= : Comma separated list of product ids to update (optional). If omitted, will update all produits where Code_produit LIKE "REC-%"}';

    protected $description = 'Set is_recette = 1 for produits matching Code_produit LIKE REC-% or specific ids';

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

        $idsOption = $this->option('ids');

        if ($idsOption) {
            $ids = array_filter(array_map('trim', explode(',', $idsOption)), fn($v) => $v !== '');
            if (empty($ids)) {
                $this->error('No valid ids provided.');
                return 1;
            }
            $query = Produit::whereIn('id', $ids);
        } else {
            $query = Produit::where('Code_produit', 'like', 'REC-%');
        }

        // limit to rows that are not already marked
        $query = $query->where(function ($q) {
            $q->whereNull('is_recette')->orWhere('is_recette', 0);
        });

        $count = $query->count();
        if ($count === 0) {
            $this->info('No matching produits found that need updating.');
            return 0;
        }

        $updated = $query->update(['is_recette' => 1]);

        $this->info("Updated $updated produits by setting is_recette = 1.");
        return 0;
    }
}
