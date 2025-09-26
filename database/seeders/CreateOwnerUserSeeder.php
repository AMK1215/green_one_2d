<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreateOwnerUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Owner user if it doesn't exist
        $owner = User::firstOrCreate(
            ['user_name' => 'OWNER001'],
            [
                'name' => 'System Owner',
                'email' => 'owner@example.com',
                'password' => Hash::make('password123'),
                'type' => '10', // Owner type as string
                'status' => 1,
                'max_score' => 0.00,
            ]
        );

        // Assign Owner role
        $ownerRole = Role::where('title', 'Owner')->first();
        if ($ownerRole) {
            $owner->roles()->sync([$ownerRole->id]);
            echo "Owner user created/updated: {$owner->user_name} with role: {$ownerRole->title}\n";
        } else {
            echo "Owner role not found!\n";
        }
    }
}
