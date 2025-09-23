<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TwoDigit\TwoBet;
use App\Models\TwoDigit\TwoBetSlip;
use App\Models\TransferLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class OwnerDashboardController extends Controller
{

    public function dashboard()
    {
        $user = Auth::user();
        
        // Get dashboard statistics with error handling
        try {
            $stats = $this->getDashboardStats();
        } catch (\Exception $e) {
            // Fallback stats if there's an error
            $stats = [
                'total_agents' => 0,
                'total_players' => 0,
                'active_players_today' => 0,
                'my_balance' => $user->balanceFloat ?? 0,
                'total_balance' => $user->balanceFloat ?? 0,
                'total_bets_today' => 0,
                'total_bet_amount_today' => 0,
                'total_transfers_today' => 0,
                'total_transfer_amount_today' => 0,
            ];
        }
        
        // Get recent activities with error handling
        try {
            $recentActivities = $this->getRecentActivities();
        } catch (\Exception $e) {
            $recentActivities = [];
        }
        
        // Get betting statistics with error handling
        try {
            $bettingStats = $this->getBettingStats();
        } catch (\Exception $e) {
            $bettingStats = [
                'daily_bets' => [],
                'popular_numbers' => [],
            ];
        }

        return Inertia::render('OwnerDashboard', [
            'user' => [
                'id' => $user->id,
                'user_name' => $user->user_name,
                'name' => $user->name,
                'balanceFloat' => $user->balanceFloat ?? 0,
            ],
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'bettingStats' => $bettingStats,
        ]);
    }

    private function getDashboardStats()
    {
        $today = Carbon::today();
        $user = Auth::user();

        // Get all users with wallet balances
        $agents = User::whereHas('roles', fn($q) => $q->where('title', 'Agent'))->get();
        $players = User::whereHas('roles', fn($q) => $q->where('title', 'Player'))->get();
        
        // Calculate total system balance using Laravel Wallet
        $totalSystemBalance = $user->balanceFloat; // Owner balance
        foreach ($agents as $agent) {
            $totalSystemBalance += $agent->balanceFloat;
        }
        foreach ($players as $player) {
            $totalSystemBalance += $player->balanceFloat;
        }

        return [
            'total_agents' => $agents->count(),
            'total_players' => $players->count(),
            'active_players_today' => $players->where('updated_at', '>=', $today)->count(),
            'my_balance' => $user->balanceFloat, // Owner's wallet balance
            'total_balance' => $totalSystemBalance, // Total system liquidity
            'total_bets_today' => TwoBet::whereDate('created_at', $today)->count(),
            'total_bet_amount_today' => TwoBet::whereDate('created_at', $today)->sum('bet_amount'),
            'total_transfers_today' => TransferLog::whereDate('created_at', $today)->count(),
            'total_transfer_amount_today' => TransferLog::whereDate('created_at', $today)->sum('amount'),
        ];
    }

    private function getRecentActivities()
    {
        return collect([
            // Recent user registrations
            User::with('roles')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($user) => [
                    'type' => 'user_created',
                    'message' => "New {$user->roles->first()?->title} created: {$user->user_name}",
                    'time' => $user->created_at,
                    'user' => $user->user_name,
                ]),
            
            // Recent transfers
            TransferLog::with(['fromUser', 'toUser'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($transfer) => [
                    'type' => 'transfer',
                    'message' => "Transfer: {$transfer->fromUser?->user_name} → {$transfer->toUser?->user_name} ({$transfer->amount})",
                    'time' => $transfer->created_at,
                    'amount' => $transfer->amount,
                ]),
        ])->flatten(1)->sortByDesc('time')->take(10)->values();
    }

    private function getBettingStats()
    {
        $last7Days = Carbon::now()->subDays(7);
        
        return [
            'daily_bets' => TwoBet::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(bet_amount) as amount')
            )
            ->where('created_at', '>=', $last7Days)
            ->groupBy('date')
            ->orderBy('date')
            ->get(),
            
            'popular_numbers' => TwoBet::select('bet_number', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', $last7Days)
                ->groupBy('bet_number')
                ->orderByDesc('count')
                ->take(10)
                ->get(),
        ];
    }

    public function agents()
    {
        $agents = User::with(['roles', 'children'])
            ->whereHas('roles', fn($q) => $q->where('title', 'Agent'))
            ->withSum('children as players_count', DB::raw('1'))
            ->paginate(15);

        return Inertia::render('admin/Agents', [
            'agents' => $agents,
        ]);
    }

    public function reports()
    {
        $dateRange = request('date_range', 'today');
        
        $query = TwoBet::with(['user'])
            ->when($dateRange === 'today', fn($q) => $q->whereDate('created_at', Carbon::today()))
            ->when($dateRange === 'week', fn($q) => $q->where('created_at', '>=', Carbon::now()->subWeek()))
            ->when($dateRange === 'month', fn($q) => $q->where('created_at', '>=', Carbon::now()->subMonth()));

        $reports = [
            'total_bets' => $query->count(),
            'total_amount' => $query->sum('bet_amount'),
            'by_agent' => $query->clone()
                ->join('users', 'two_bets.user_id', '=', 'users.id')
                ->join('users as agents', 'users.agent_id', '=', 'agents.id')
                ->select('agents.user_name as agent_name', 
                        DB::raw('COUNT(*) as bet_count'),
                        DB::raw('SUM(two_bets.bet_amount) as total_amount'))
                ->groupBy('agents.id', 'agents.user_name')
                ->get(),
        ];

        return Inertia::render('admin/Reports', [
            'reports' => $reports,
            'dateRange' => $dateRange,
        ]);
    }
}
