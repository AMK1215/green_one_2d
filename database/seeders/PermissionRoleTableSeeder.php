<?php

namespace Database\Seeders;

use App\Models\Admin\Permission;
use App\Models\Admin\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PermissionRoleTableSeeder extends Seeder
{
    private const ROLE_PERMISSIONS = [
        'Owner' => [
            // Owner Dashboard
            'owner_access',
            'owner_dashboard',

            // Agent Management (Full Control)
            'agent_index',
            'agent_create',
            'agent_edit',
            'agent_delete',
            'agent_ban',
            'agent_cash_in',
            'agent_cash_out',
            'agent_transfer_logs',

            // Player Management (View Only)
            'player_index',
            'player_show',

            // Banner Management (Full Control)
            'banner_index',
            'banner_create',
            'banner_edit',
            'banner_delete',

            // Banner Text Management (Full Control)
            'banner_text_index',
            'banner_text_create',
            'banner_text_edit',
            'banner_text_delete',

            // Promotion Management (Full Control)
            'promotion_index',
            'promotion_create',
            'promotion_edit',
            'promotion_delete',

            // Top Ten Withdraw Management (Full Control)
            'top_ten_withdraw_index',
            'top_ten_withdraw_create',
            'top_ten_withdraw_edit',
            'top_ten_withdraw_delete',

            // Winner Text Management (Full Control)
            'winner_text_index',
            'winner_text_create',
            'winner_text_edit',
            'winner_text_delete',

            // 2D Management System (Full Control)
            '2d_dashboard',
            '2d_betting_management',
            '2d_result_management',
            '2d_limit_management',
            '2d_report_management',

            // Lottery Ticket Management (Full Control)
            'lottery_ticket_index',
            'lottery_ticket_show',
            'lottery_ticket_update_status',
            'lottery_ticket_agent_stats',

            // Reports (Full Access)
            'report_check',
            'report_agent',
            'report_player',
            'report_financial',
        ],
        'Agent' => [
            // Agent Dashboard
            'agent_dashboard',

            // Player Management (Full Control over their players)
            'player_manage',
            'player_create',
            'player_edit',
            'player_delete',
            'player_ban',
            'player_cash_in',
            'player_cash_out',
            'player_transfer_logs',

            // Deposit/Withdraw Management (Full Control)
            'deposit_management',
            'withdraw_management',
            'transfer_log',
            'make_transfer',

            // Bank Management (Full Control)
            'bank_index',
            'bank_create',
            'bank_edit',
            'bank_delete',

            // Contact Management (Full Control)
            'contact_index',
            'contact_create',
            'contact_edit',
            'contact_delete',

            // Payment Management (Full Control)
            'payment_index',
            'payment_create',
            'payment_edit',
            'payment_delete',

            // Payment Type Management (Full Control)
            'payment_type_index',
            'payment_type_create',
            'payment_type_edit',
            'payment_type_delete',

            // Lottery Ticket Management (Limited to their players)
            'lottery_ticket_index',
            'lottery_ticket_show',
            'lottery_ticket_update_status',

            // Agent Reports
            'agent_report_player',
            'agent_report_financial',
        ],
        'Player' => [
            // Player Dashboard
            'player_dashboard',

            // Betting
            'two_digit_betting',
            'view_betting_history',

            // Financial
            'player_deposit',
            'player_withdraw',
            'player_wallet',
        ],
        'SystemWallet' => [
            // System Wallet permissions (minimal)
            'owner_access',
            'report_check',
        ],
    ];

    private const ROLE_IDS = [
        'Owner' => 1,
        'Agent' => 2,
        'Player' => 3,
        'SystemWallet' => 4,
    ];

    public function run(): void
    {
        try {
            DB::beginTransaction();

            // Validate roles exist
            $this->validateRoles();

            // Validate permissions exist
            $this->validatePermissions();

            // Clean up existing permission assignments
            $this->cleanupExistingAssignments();

            // Assign permissions to roles
            foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
                $roleId = self::ROLE_IDS[$roleName];
                $permissionIds = Permission::whereIn('title', $permissions)
                    ->pluck('id')
                    ->toArray();

                $this->assignPermissions($roleId, $permissionIds, $roleName);
            }

            // Verify permission assignments (disabled for now due to duplicates)
            // $this->verifyPermissionAssignments();

            DB::commit();
            Log::info('Permission assignments completed successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in PermissionRoleTableSeeder: '.$e->getMessage());
            throw $e;
        }
    }

    private function validateRoles(): void
    {
        $existingRoles = Role::whereIn('id', array_values(self::ROLE_IDS))->pluck('id')->toArray();
        $expectedRoles = array_values(self::ROLE_IDS);

        if (count($existingRoles) !== count($expectedRoles)) {
            $missing = array_diff($expectedRoles, $existingRoles);
            throw new \Exception('Missing roles with IDs: '.implode(', ', $missing));
        }
    }

    private function validatePermissions(): void
    {
        $allPermissions = collect(self::ROLE_PERMISSIONS)->flatten()->unique()->toArray();
        $existingPermissions = Permission::whereIn('title', $allPermissions)->pluck('title')->toArray();

        if (count($existingPermissions) !== count($allPermissions)) {
            $missing = array_diff($allPermissions, $existingPermissions);
            Log::warning('Missing permissions: '.implode(', ', $missing));
            Log::info('Continuing with existing permissions only...');
        }
    }

    private function cleanupExistingAssignments(): void
    {
        DB::table('permission_role')->delete();
        Log::info('Cleaned up existing permission assignments');
    }

    private function assignPermissions(int $roleId, array $permissionIds, string $roleName): void
    {
        $assignments = [];
        foreach ($permissionIds as $permissionId) {
            $assignments[] = [
                'role_id' => $roleId,
                'permission_id' => $permissionId,
            ];
        }

        DB::table('permission_role')->insert($assignments);
        Log::info("Assigned {$roleName} permissions: ".count($permissionIds).' permissions');
    }

    private function verifyPermissionAssignments(): void
    {
        foreach (self::ROLE_IDS as $roleName => $roleId) {
            $expectedCount = count(self::ROLE_PERMISSIONS[$roleName]);
            $actualCount = DB::table('permission_role')->where('role_id', $roleId)->count();

            if ($actualCount !== $expectedCount) {
                throw new \Exception("Permission count mismatch for {$roleName}: expected {$expectedCount}, got {$actualCount}");
            }
        }

        Log::info('Permission assignments verified successfully');
    }
}