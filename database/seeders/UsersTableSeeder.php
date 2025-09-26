<?php

namespace Database\Seeders;

use App\Enums\TransactionName;
use App\Enums\UserType;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $walletService = new WalletService;

        // Create owner with large initial capital
        $owner = $this->createUser(
            UserType::Owner,
            'Owner',
            'OWNER001',
            '09123456789',
            null,
            'OWNER'.Str::random(6)
        );
        $walletService->deposit($owner, 500_000_00000000, TransactionName::CapitalDeposit);

        // Create system wallet
        $systemWallet = $this->createUser(
            UserType::SystemWallet,
            'System Wallet',
            'SYS001',
            '09222222222',
            null,
            'SYS'.Str::random(6)
        );
        $walletService->deposit($systemWallet, 500 * 100_0000, TransactionName::CapitalDeposit);

        // Create agents directly under owner
        for ($i = 1; $i <= 2; $i++) {
            $agent = $this->createUser(
                UserType::Agent,
                "Agent $i",
                'AGENTPW'.str_pad($i, 3, '0', STR_PAD_LEFT),
                '091123456'.str_pad($i, 2, '0', STR_PAD_LEFT),
                $owner->id,
                'AGENTPW'.Str::random(6)
            );
            // Random initial balance between 100K to 200K
            $initialBalance = rand(1, 2) * 100_000;
            $walletService->transfer($owner, $agent, $initialBalance, TransactionName::CreditTransfer);

            // Create players directly under each agent (no sub-agents)
            for ($k = 1; $k <= 4; $k++) {
                $player = $this->createUser(
                    UserType::Player,
                    "Player $i-$k",
                    'PWPLAYER'.str_pad($i, 2, '0', STR_PAD_LEFT).str_pad($k, 2, '0', STR_PAD_LEFT),
                    '091111111'.str_pad($i, 1, '0', STR_PAD_LEFT).str_pad($k, 2, '0', STR_PAD_LEFT),
                    $agent->id,
                    'PWPLAYER'.Str::random(6)
                );
                // Fixed initial balance of 10,000
                $initialBalance = 10000;
                $walletService->transfer($agent, $player, $initialBalance, TransactionName::CreditTransfer);
            }
        }

        // Add SKP0101 player with overwrite functionality
        $this->addPlayerSKP0101($owner->id, $walletService);
    }

    private function addPlayerSKP0101(int $ownerId, WalletService $walletService): void
    {
        // Find first agent to assign this player to
        $agent = User::where('type', UserType::Agent->value)
                    ->where('agent_id', $ownerId)
                    ->first();

        if (!$agent) {
            throw new \Exception('No agent found to assign SKP0101 player to');
        }

        // Create new player
        $player = $this->createUser(
            UserType::Player,
            'SKP Player',
            'SKP0101',
            '09123456789',
            $agent->id,
            'SKP' . Str::random(6)
        );
        
        // Initial balance of 10,000
        $walletService->transfer($agent, $player, 10000, TransactionName::CreditTransfer);
        
        echo "Created player SKP0101\n";
    }

    private function createUser(
        UserType $type,
        string $name,
        string $user_name,
        string $phone,
        ?int $parent_id = null,
        ?string $referral_code = null
    ): User {
        return User::create([
            'name' => $name,
            'user_name' => $user_name,
            'phone' => $phone,
            'password' => Hash::make('gscplus'),
            'agent_id' => $parent_id,
            'status' => 1,
            'is_changed_password' => 1,
            'type' => $type->value,
            'referral_code' => $referral_code,
        ]);
    }
}
