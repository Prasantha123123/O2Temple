<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Customize the login redirect based on user role
        Fortify::redirects('login', function (Request $request) {
            $user = $request->user();
            
            if (!$user->role) {
                return '/dashboard'; // Default if no role assigned
            }
            
            return match($user->role->name) {
                'Admin' => '/admin/dashboard',
                'Receptionist' => '/receptionist/dashboard',
                'Staff' => '/staff/dashboard',
                default => '/dashboard',
            };
        });
    }
}
