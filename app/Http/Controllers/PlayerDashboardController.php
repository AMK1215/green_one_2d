<?php

namespace App\Http\Controllers;

use App\Models\TwoDigit\TwoBet;
use App\Models\TransferLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class PlayerDashboardController extends Controller
{

    public function dashboard()
    {
        $user = Auth::user();
        
        // Get dashboard statistics
        $stats = $this->getDashboardStats();
        
        // Get recent bets
        $recentBets = $this->getRecentBets();
        
        // Get betting history summary
        $bettingHistory = $this->getBettingHistory();

        return Inertia::render('player/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentBets' => $recentBets,
            'bettingHistory' => $bettingHistory,
        ]);
    }

    private function getDashboardStats()
    {
        $user = Auth::user();
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'balance' => $user->balanceFloat,
            'total_bets_today' => TwoBet::where('user_id', $user->id)->whereDate('created_at', $today)->count(),
            'total_bet_amount_today' => TwoBet::where('user_id', $user->id)->whereDate('created_at', $today)->sum('bet_amount'),
            'total_bets_week' => TwoBet::where('user_id', $user->id)->where('created_at', '>=', $thisWeek)->count(),
            'total_bet_amount_week' => TwoBet::where('user_id', $user->id)->where('created_at', '>=', $thisWeek)->sum('bet_amount'),
            'total_bets_month' => TwoBet::where('user_id', $user->id)->where('created_at', '>=', $thisMonth)->count(),
            'total_bet_amount_month' => TwoBet::where('user_id', $user->id)->where('created_at', '>=', $thisMonth)->sum('bet_amount'),
            'favorite_numbers' => TwoBet::where('user_id', $user->id)
                ->select('bet_number', DB::raw('COUNT(*) as count'))
                ->groupBy('bet_number')
                ->orderByDesc('count')
                ->take(5)
                ->get(),
        ];
    }

    private function getRecentBets()
    {
        $user = Auth::user();
        
        return TwoBet::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(function($bet) {
                return [
                    'id' => $bet->id,
                    'bet_number' => $bet->bet_number,
                    'bet_amount' => $bet->bet_amount,
                    'session' => $bet->session,
                    'status' => $bet->bet_status,
                    'result' => $bet->bet_result,
                    'potential_payout' => $bet->potential_payout,
                    'created_at' => $bet->created_at,
                ];
            });
    }

    private function getBettingHistory()
    {
        $user = Auth::user();
        $last7Days = Carbon::now()->subDays(7);
        
        return TwoBet::where('user_id', $user->id)
            ->where('created_at', '>=', $last7Days)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as bet_count'),
                DB::raw('SUM(bet_amount) as total_amount')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function bettingHistory(Request $request)
    {
        $user = Auth::user();
        $dateRange = $request->get('date_range', 'week');
        
        $query = TwoBet::where('user_id', $user->id);
        
        switch ($dateRange) {
            case 'today':
                $query->whereDate('created_at', Carbon::today());
                break;
            case 'week':
                $query->where('created_at', '>=', Carbon::now()->subWeek());
                break;
            case 'month':
                $query->where('created_at', '>=', Carbon::now()->subMonth());
                break;
        }
        
        $bets = $query->latest()->paginate(20);
        
        return Inertia::render('player/BettingHistory', [
            'bets' => $bets,
            'dateRange' => $dateRange,
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

        return Inertia::render('player/Transfers', [
            'transfers' => $transfers,
        ]);
    }
}
