<?php

namespace Database\Seeders;

use App\Models\Admin\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing permissions to avoid duplicates
        Permission::truncate();
        
        $permissions = [
            // ===== OWNER PERMISSIONS =====
            // Owner has full system control
            [
                'title' => 'owner_access',
                'group' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'owner_dashboard',
                'group' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Agent Management (Owner can fully manage agents)
            [
                'title' => 'agent_index',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_create',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_edit',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_delete',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_ban',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_cash_in',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_cash_out',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_transfer_logs',
                'group' => 'agent',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Player Management (Owner can view all players)
            [
                'title' => 'player_index',
                'group' => 'player',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_show',
                'group' => 'player',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_transfer_logs',
                'group' => 'player',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Banner Management (Owner has full control)
            [
                'title' => 'banner_index',
                'group' => 'banner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_create',
                'group' => 'banner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_edit',
                'group' => 'banner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_delete',
                'group' => 'banner',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Banner Text Management (Owner has full control)
            [
                'title' => 'banner_text_index',
                'group' => 'banner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_text_create',
                'group' => 'banner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_text_edit',
                'group' => 'banner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'banner_text_delete',
                'group' => 'banner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Promotion Management (Owner has full control)
            [
                'title' => 'promotion_index',
                'group' => 'promotion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'promotion_create',
                'group' => 'promotion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'promotion_edit',
                'group' => 'promotion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'promotion_delete',
                'group' => 'promotion',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Top Ten Withdraw Management (Owner has full control)
            [
                'title' => 'top_ten_withdraw_index',
                'group' => 'top_ten_withdraw',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'top_ten_withdraw_create',
                'group' => 'top_ten_withdraw',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'top_ten_withdraw_edit',
                'group' => 'top_ten_withdraw',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'top_ten_withdraw_delete',
                'group' => 'top_ten_withdraw',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Winner Text Management (Owner has full control)
            [
                'title' => 'winner_text_index',
                'group' => 'winner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'winner_text_create',
                'group' => 'winner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'winner_text_edit',
                'group' => 'winner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'winner_text_delete',
                'group' => 'winner_text',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 2D Management System (Owner has full control)
            [
                'title' => '2d_dashboard',
                'group' => '2d_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '2d_betting_management',
                'group' => '2d_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '2d_result_management',
                'group' => '2d_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '2d_limit_management',
                'group' => '2d_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '2d_report_management',
                'group' => '2d_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Lottery Ticket Management (Owner has full control)
            [
                'title' => 'lottery_ticket_index',
                'group' => 'lottery_ticket',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'lottery_ticket_show',
                'group' => 'lottery_ticket',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'lottery_ticket_update_status',
                'group' => 'lottery_ticket',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'lottery_ticket_agent_stats',
                'group' => 'lottery_ticket',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Reports (Owner has full access)
            [
                'title' => 'report_check',
                'group' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'report_agent',
                'group' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'report_player',
                'group' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'report_financial',
                'group' => 'report',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== AGENT PERMISSIONS =====
            // Agent Dashboard
            [
                'title' => 'agent_dashboard',
                'group' => 'agent_dashboard',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Player Management (Agent has full control over their players)
            [
                'title' => 'player_manage',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_create',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_edit',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_delete',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_ban',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_cash_in',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_cash_out',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_transfer_logs',
                'group' => 'player_management',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Deposit/Withdraw Management (Agent has full control)
            [
                'title' => 'deposit_management',
                'group' => 'financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'withdraw_management',
                'group' => 'financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'transfer_log',
                'group' => 'financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'make_transfer',
                'group' => 'financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Bank Management (Agent has full control)
            [
                'title' => 'bank_index',
                'group' => 'bank',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'bank_create',
                'group' => 'bank',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'bank_edit',
                'group' => 'bank',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'bank_delete',
                'group' => 'bank',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Contact Management (Agent has full control)
            [
                'title' => 'contact_index',
                'group' => 'contact',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'contact_create',
                'group' => 'contact',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'contact_edit',
                'group' => 'contact',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'contact_delete',
                'group' => 'contact',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Payment Management (Agent has full control)
            [
                'title' => 'payment_index',
                'group' => 'payment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_create',
                'group' => 'payment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_edit',
                'group' => 'payment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_delete',
                'group' => 'payment',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Payment Type Management (Agent has full control)
            [
                'title' => 'payment_type_index',
                'group' => 'payment_type',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_type_create',
                'group' => 'payment_type',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_type_edit',
                'group' => 'payment_type',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'payment_type_delete',
                'group' => 'payment_type',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Agent Reports
            [
                'title' => 'agent_report_player',
                'group' => 'agent_report',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'agent_report_financial',
                'group' => 'agent_report',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== PLAYER PERMISSIONS =====
            [
                'title' => 'player_dashboard',
                'group' => 'player_dashboard',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'two_digit_betting',
                'group' => 'player_betting',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'view_betting_history',
                'group' => 'player_betting',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_deposit',
                'group' => 'player_financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_withdraw',
                'group' => 'player_financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'player_wallet',
                'group' => 'player_financial',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Permission::insert($permissions);
    }
}