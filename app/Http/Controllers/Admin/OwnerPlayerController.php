<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TransferLog;
use App\Models\User;
use App\Models\TwoDigit\TwoBet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OwnerPlayerController extends Controller
{
    /**
     * Display a listing of all players for Owner (read-only view)
     */
    public function index(): Response
    {
        // Get all players in the system (Owner can see all players)
        $players = User::with(['roles', 'agent'])
            ->whereHas('roles', function ($query) {
                $query->where('title', 'Player');
            })
            ->select('id', 'name', 'user_name', 'phone', 'status', 'referral_code', 'agent_id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get player IDs for statistics
        $playerIds = $players->pluck('id');

        // Get betting statistics
        $spinTotals = TwoBet::query()
            ->selectRaw('player_id, COUNT(DISTINCT wager_code) as total_spin')
            ->whereIn('player_id', $playerIds)
            ->groupBy('player_id')
            ->get()
            ->keyBy('player_id');

        $betTotals = TwoBet::query()
            ->selectRaw('player_id, SUM(bet_amount) as total_bet_amount')
            ->whereIn('player_id', $playerIds)
            ->where('status', 'settled')
            ->groupBy('player_id')
            ->get()
            ->keyBy('player_id');

        $settleTotals = TwoBet::query()
            ->selectRaw('player_id, SUM(payout_amount) as total_payout_amount')
            ->whereIn('player_id', $playerIds)
            ->where('status', 'settled')
            ->groupBy('player_id')
            ->get()
            ->keyBy('player_id');

        // Transform players with statistics
        $playersWithStats = $players->map(function ($player) use ($spinTotals, $betTotals, $settleTotals) {
            return [
                'id' => $player->id,
                'name' => $player->name,
                'user_name' => $player->user_name,
                'phone' => $player->phone,
                'status' => $player->status,
                'referral_code' => $player->referral_code,
                'agent_id' => $player->agent_id,
                'agent_name' => $player->agent ? $player->agent->name : 'Unknown',
                'created_at' => $player->created_at,
                'total_spin' => $spinTotals->get($player->id)?->total_spin ?? 0,
                'total_bet_amount' => $betTotals->get($player->id)?->total_bet_amount ?? 0,
                'total_payout_amount' => $settleTotals->get($player->id)?->total_payout_amount ?? 0,
            ];
        });

        return Inertia::render('admin/OwnerPlayers/Index', [
            'players' => $playersWithStats,
            'canCreate' => false, // Owner cannot create players
        ]);
    }

    /**
     * Display player transfer logs for Owner
     */
    public function getTransferLogs(User $player): Response
    {
        $transfer_logs = TransferLog::where('from_user_id', $player->id)
            ->orWhere('to_user_id', $player->id)
            ->with(['fromUser', 'toUser'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/OwnerPlayers/TransferLogs', [
            'player' => $player,
            'transferLogs' => $transfer_logs,
        ]);
    }

    /**
     * Display individual player details for Owner
     */
    public function show(User $player): Response
    {
        // Ensure the user is a player
        if (!$player->hasRole('Player')) {
            abort(404, 'Player not found');
        }

        // Get player statistics
        $spinTotal = TwoBet::where('player_id', $player->id)
            ->distinct('wager_code')
            ->count('wager_code');

        $betTotal = TwoBet::where('player_id', $player->id)
            ->where('status', 'settled')
            ->sum('bet_amount');

        $payoutTotal = TwoBet::where('player_id', $player->id)
            ->where('status', 'settled')
            ->sum('payout_amount');

        $playerData = [
            'id' => $player->id,
            'name' => $player->name,
            'user_name' => $player->user_name,
            'phone' => $player->phone,
            'status' => $player->status,
            'referral_code' => $player->referral_code,
            'agent_id' => $player->agent_id,
            'agent_name' => $player->agent ? $player->agent->name : 'Unknown',
            'created_at' => $player->created_at,
            'total_spin' => $spinTotal,
            'total_bet_amount' => $betTotal,
            'total_payout_amount' => $payoutTotal,
        ];

        return Inertia::render('admin/OwnerPlayers/Show', [
            'player' => $playerData,
        ]);
    }
}
