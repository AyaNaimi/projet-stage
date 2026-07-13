<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Produit;

class ProductPolicy
{
    public function viewAllProducts(User $user)
    {
        return true;
    }
    
    public function createProduct(User $user)
    {
        return true;
    }
    
    public function viewProduct(User $user)
    {
        return true;
    }
    
    public function editProduct(User $user)
    {
        return true;
    }
    
    public function deleteProduct(User $user)
    {
        return true;
    }
}
