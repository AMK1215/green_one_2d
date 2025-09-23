<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Log::info('Starting database seeding process...');

        try {
            // Step 1: Create roles first
            $this->call(RolesTableSeeder::class);
            Log::info('✓ Roles seeded successfully');

            // Step 2: Create permissions
            $this->call(PermissionsTableSeeder::class);
            Log::info('✓ Permissions seeded successfully');

            // Step 3: Assign permissions to roles
            $this->call(PermissionRoleTableSeeder::class);
            Log::info('✓ Permission-Role relationships seeded successfully');

            // Step 4: Create users
            $this->call(UsersTableSeeder::class);
            Log::info('✓ Users seeded successfully');

            // Step 5: Assign roles to users
            $this->call(RoleUserTableSeeder::class);
            Log::info('✓ User-Role relationships seeded successfully');

            // Step 6: Additional seeders (if any)
            // Uncomment the seeders you have available
           
            $this->call([
                ContactTypeSeeder::class,
                ContactSeeder::class,
                PaymentTypeTableSeeder::class,
                BankTableSeeder::class,
                TwoDLimitSeeder::class,
                ChooseDigitSeeder::class,
                WinnerTextSeeder::class,
                HeadCloseSeeder::class,
                TwoDLimitSeeder::class,
                BattleTableSeeder::class,
                // Add other seeders as needed
            ]);
            

            Log::info('✓ All additional seeders completed successfully');
            Log::info('🎉 Database seeding completed successfully!');

        } catch (\Exception $e) {
            Log::error('❌ Database seeding failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}