<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Redirect to admin login if not authenticated
    if (!auth()->check()) {
        return redirect('/admin/login');
    }
    
    // If authenticated, redirect based on role
    $user = auth()->user();
    if ($user->hasRole('Owner')) {
        return redirect()->route('admin.owner.dashboard');
    } elseif ($user->hasRole('Agent')) {
        return redirect()->route('admin.agent.dashboard');
    } elseif ($user->hasRole('Player')) {
        return redirect()->route('player.dashboard');
    }
    
    return redirect('/admin/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Only Owner and Agent can access admin dashboard
        if ($user->hasRole('Owner')) {
            return redirect()->route('owner.dashboard');
        } elseif ($user->hasRole('Agent')) {
            return redirect()->route('agent.dashboard');
        } elseif ($user->hasRole('Player')) {
            // Players should not access admin dashboard
            abort(403, 'Players are not allowed to access the admin dashboard.');
        }
        
        // Unknown role - redirect to login
        return redirect('/admin/login');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
