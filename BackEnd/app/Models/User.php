<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'photo',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = $value;
    }

    protected $dontHashPassword = true;
    
    public function hasRole($role)
    {
        return true;
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasAnyRole($roles)
    {
        return true;
    }

    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $this->roles()->sync([$role->id]);

    }
// // Dans le modèle User (app/Models/User.php)
// public function hasPermission($permission)
// {
//     // Vérifier si l'utilisateur a la permission (cela peut être une relation ou une simple vérification de tableau)
//     return in_array($permission, $this->permissions);
// }

    public function hasPermission($permission)
    {
        return true;
    }
}
