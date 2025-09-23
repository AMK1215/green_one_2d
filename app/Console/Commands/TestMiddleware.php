<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class TestMiddleware extends Command
{
    protected $signature = 'middleware:test {username}';
    protected $description = 'Test middleware functionality for a specific user';

    public function handle()
    {
        $username = $this->argument('username');
        $user = User::where('user_name', $username)->first();

        if (!$user) {
            $this->error("User '{$username}' not found!");
            return 1;
        }

        $this->info("Testing middleware for user: {$user->user_name}");
        $this->info("User roles: " . $user->roles->pluck('title')->implode(', '));
        
        // Test role checks
        $this->info("\n--- Role Tests ---");
        $this->info("Is Owner: " . ($user->hasRole('Owner') ? '✅ Yes' : '❌ No'));
        $this->info("Is Agent: " . ($user->hasRole('Agent') ? '✅ Yes' : '❌ No'));
        $this->info("Is Player: " . ($user->hasRole('Player') ? '✅ Yes' : '❌ No'));
        $this->info("Is SystemWallet: " . ($user->hasRole('SystemWallet') ? '✅ Yes' : '❌ No'));

        // Test permission checks
        $this->info("\n--- Permission Tests ---");
        $permissions = [
            'agent_create',
            'player_create',
            'two_digit_betting',
            'view_betting_reports',
            'make_transfer',
            'dashboard_access'
        ];

        foreach ($permissions as $permission) {
            $hasPermission = $user->hasPermission($permission);
            $this->info("{$permission}: " . ($hasPermission ? '✅ Yes' : '❌ No'));
        }

        // Test status
        $this->info("\n--- Status Tests ---");
        $this->info("Status: " . ($user->status ? '✅ Active' : '❌ Inactive'));
        $this->info("Password Changed: " . ($user->is_changed_password ? '✅ Yes' : '❌ No'));
        $this->info("Balance: " . number_format($user->balanceFloat, 2));

        return 0;
    }
}
