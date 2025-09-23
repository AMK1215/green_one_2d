<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TwoDigit\TwoBet;
use App\Models\TransferLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AgentDashboardController extends Controller
{

    public function dashboard()
    {
        $user = Auth::user();
        
        // Get dashboard statistics
        $stats = $this->getDashboardStats();
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities();
        
        // Get player performance
        $playerStats = $this->getPlayerStats();

        return Inertia::render('AgentDashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'playerStats' => $playerStats,
        ]);
    }

    private function getDashboardStats()
    {
        $user = Auth::user();
        $today = Carbon::today();
        
        // Get players under this agent
        $players = $user->children()->whereHas('roles', fn($q) => $q->where('title', 'Player'))->get();
        $playerIds = $players->pluck('id');

        // Calculate total players balance using Laravel Wallet
        $totalPlayersBalance = 0;
        foreach ($players as $player) {
            $totalPlayersBalance += $player->balanceFloat;
        }

        return [
            'total_players' => $players->count(),
            'active_players_today' => $players->where('updated_at', '>=', $today)->count(),
            'my_balance' => $user->balanceFloat, // Agent's wallet balance
            'total_players_balance' => $totalPlayersBalance, // Sum of all player wallet balances
            'total_bets_today' => TwoBet::whereIn('user_id', $playerIds)
                ->whereDate('created_at', $today)
                ->count(),
            'total_bet_amount_today' => TwoBet::whereIn('user_id', $playerIds)
                ->whereDate('created_at', $today)
                ->sum('bet_amount'),
            'total_transfers_today' => TransferLog::where(function($q) use ($user) {
                $q->where('from_user_id', $user->id)->orWhere('to_user_id', $user->id);
            })
            ->whereDate('created_at', $today)
            ->count(),
        ];
    }

    private function getRecentActivities()
    {
        $user = Auth::user();
        $playerIds = $user->children()->pluck('id');

        return collect([
            // Recent player bets
            TwoBet::whereIn('user_id', $playerIds)
                ->with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($bet) => [
                    'type' => 'bet',
                    'message' => "{$bet->user->user_name} placed bet on {$bet->bet_number} for {$bet->bet_amount}",
                    'time' => $bet->created_at,
                    'amount' => $bet->bet_amount,
                ]),
            
            // Recent transfers involving this agent
            TransferLog::with(['fromUser', 'toUser'])
                ->where(function($q) use ($user, $playerIds) {
                    $q->where('from_user_id', $user->id)
                      ->orWhere('to_user_id', $user->id)
                      ->orWhereIn('from_user_id', $playerIds)
                      ->orWhereIn('to_user_id', $playerIds);
                })
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

    private function getPlayerStats()
    {
        $user = Auth::user();
        $last7Days = Carbon::now()->subDays(7);
        
        return $user->children()
            ->whereHas('roles', fn($q) => $q->where('title', 'Player'))
            ->with(['twoBets' => fn($q) => $q->where('created_at', '>=', $last7Days)])
            ->get()
            ->map(function($player) {
                return [
                    'id' => $player->id,
                    'user_name' => $player->user_name,
                    'name' => $player->name,
                    'balance' => $player->balanceFloat, // Laravel Wallet balance
                    'total_bets' => $player->twoBets->count(),
                    'total_bet_amount' => $player->twoBets->sum('bet_amount'),
                    'status' => $player->status,
                    'last_activity' => $player->updated_at,
                ];
            })
            ->sortByDesc('total_bet_amount')
            ->take(10)
            ->values();
    }

    public function players()
    {
        $user = Auth::user();
        
        $players = $user->children()
            ->whereHas('roles', fn($q) => $q->where('title', 'Player'))
            ->with('roles')
            ->withCount(['twoBets as total_bets'])
            ->withSum(['twoBets as total_bet_amount'], 'bet_amount')
            ->get()
            ->map(function($player) {
                return [
                    'id' => $player->id,
                    'user_name' => $player->user_name,
                    'name' => $player->name,
                    'phone' => $player->phone,
                    'balance' => $player->balanceFloat, // Laravel Wallet balance
                    'status' => $player->status,
                    'total_bets' => $player->total_bets,
                    'total_bet_amount' => $player->total_bet_amount,
                    'created_at' => $player->created_at,
                ];
            });

        return Inertia::render('admin/Players', [
            'players' => $players,
        ]);
    }

    public function transfers()
    {
        $user = Auth::user();
        
        $transfers = TransferLog::with(['fromUser', 'toUser'])
            ->where(function($q) use ($user) {
                $q->where('from_user_id', $user->id)->orWhere('to_user_id', $user->id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/Transfers', [
            'transfers' => $transfers,
        ]);
    }

    public function reports()
    {
        $user = Auth::user();
        $dateRange = request('date_range', 'today');
        $playerIds = $user->children()->whereHas('roles', fn($q) => $q->where('title', 'Player'))->pluck('id');
        
        $query = TwoBet::with(['user'])
            ->whereIn('user_id', $playerIds)
            ->when($dateRange === 'today', fn($q) => $q->whereDate('created_at', Carbon::today()))
            ->when($dateRange === 'week', fn($q) => $q->where('created_at', '>=', Carbon::now()->subWeek()))
            ->when($dateRange === 'month', fn($q) => $q->where('created_at', '>=', Carbon::now()->subMonth()));

        $reports = [
            'total_bets' => $query->count(),
            'total_amount' => $query->sum('bet_amount'),
            'by_player' => $query->clone()
                ->join('users', 'two_bets.user_id', '=', 'users.id')
                ->select('users.user_name as player_name', 
                        DB::raw('COUNT(*) as bet_count'),
                        DB::raw('SUM(two_bets.bet_amount) as total_amount'))
                ->groupBy('users.id', 'users.user_name')
                ->get(),
            'by_number' => $query->clone()
                ->select('bet_number', 
                        DB::raw('COUNT(*) as bet_count'),
                        DB::raw('SUM(bet_amount) as total_amount'))
                ->groupBy('bet_number')
                ->orderByDesc('total_amount')
                ->take(10)
                ->get(),
        ];

        return Inertia::render('admin/Reports', [
            'reports' => $reports,
            'dateRange' => $dateRange,
        ]);
    }
}
