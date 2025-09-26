<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LotteryTicket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LotteryTicketController extends Controller
{
    /**
     * Display lottery tickets grouped by agent
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = LotteryTicket::with(['player', 'agent']);

        // Role-based filtering
        if ($user->hasRole('Owner')) { // Owner - can see all data
            // No additional filtering needed
        } elseif ($user->hasRole('Agent')) { // Agent - can only see their players' data
            $query->where('agent_id', $user->id);
        } else {
            // Other roles don't have access
            abort(403, 'Unauthorized access');
        }

        // Date filtering
        if ($request->filled('date_from')) {
            $query->whereDate('selected_datetime', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('selected_datetime', '<=', $request->date_to);
        }

        // Payment status filtering
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Agent filtering (only for Owner)
        if ($request->filled('agent_id') && $user->hasRole('Owner')) {
            $query->where('agent_id', $request->agent_id);
        }

        // Get tickets with pagination
        $tickets = $query->orderBy('selected_datetime', 'desc')
            ->paginate(50)
            ->withQueryString();

        // Get summary statistics
        $summaryQuery = LotteryTicket::query();
        
        // Apply same filters for summary
        if ($user->hasRole('Agent')) {
            $summaryQuery->where('agent_id', $user->id);
        }
        if ($request->filled('date_from')) {
            $summaryQuery->whereDate('selected_datetime', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $summaryQuery->whereDate('selected_datetime', '<=', $request->date_to);
        }
        if ($request->filled('payment_status')) {
            $summaryQuery->where('payment_status', $request->payment_status);
        }
        if ($request->filled('agent_id') && $user->hasRole('Owner')) {
            $summaryQuery->where('agent_id', $request->agent_id);
        }

        $summary = $summaryQuery->selectRaw('
            COUNT(*) as total_tickets,
            SUM(amount) as total_amount,
            COUNT(DISTINCT player_id) as total_players,
            COUNT(CASE WHEN payment_status = "completed" THEN 1 END) as completed_payments,
            COUNT(CASE WHEN payment_status = "pending" THEN 1 END) as pending_payments,
            COUNT(CASE WHEN payment_status = "failed" THEN 1 END) as failed_payments,
            SUM(CASE WHEN payment_status = "completed" THEN amount ELSE 0 END) as completed_amount,
            SUM(CASE WHEN payment_status = "pending" THEN amount ELSE 0 END) as pending_amount
        ')->first();

        // Get agents list for Owner
        $agents = [];
        if ($user->hasRole('Owner')) {
            $agents = User::whereHas('roles', function($query) {
                $query->where('title', 'Agent');
            })
                ->select('id', 'user_name', 'name')
                ->orderBy('user_name')
                ->get();
        }

        // Get tickets grouped by agent for summary
        $agentSummary = [];
        if ($user->hasRole('Owner')) {
            $agentSummaryQuery = LotteryTicket::query();
            if ($request->filled('date_from')) {
                $agentSummaryQuery->whereDate('selected_datetime', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $agentSummaryQuery->whereDate('selected_datetime', '<=', $request->date_to);
            }
            if ($request->filled('payment_status')) {
                $agentSummaryQuery->where('payment_status', $request->payment_status);
            }

            $agentSummary = $agentSummaryQuery->join('users', 'lottery_tickets.agent_id', '=', 'users.id')
                ->selectRaw('
                    users.id as agent_id,
                    users.user_name as agent_name,
                    users.name as agent_display_name,
                    COUNT(lottery_tickets.id) as ticket_count,
                    SUM(lottery_tickets.amount) as total_amount,
                    COUNT(DISTINCT lottery_tickets.player_id) as player_count,
                    COUNT(CASE WHEN lottery_tickets.payment_status = "completed" THEN 1 END) as completed_count,
                    COUNT(CASE WHEN lottery_tickets.payment_status = "pending" THEN 1 END) as pending_count
                ')
                ->groupBy('users.id', 'users.user_name', 'users.name')
                ->orderBy('total_amount', 'desc')
                ->get();
        }

        return Inertia::render('Admin/LotteryTickets/Index', [
            'tickets' => $tickets,
            'summary' => $summary,
            'agents' => $agents,
            'agentSummary' => $agentSummary,
            'filters' => $request->only(['date_from', 'date_to', 'payment_status', 'agent_id']),
            'userRole' => $user->hasRole('Owner') ? 1 : ($user->hasRole('Agent') ? 2 : 3)
        ]);
    }

    /**
     * Show individual ticket details
     */
    public function show(LotteryTicket $lotteryTicket)
    {
        $user = auth()->user();

        // Check access permissions
        if ($user->hasRole('Agent') && $lotteryTicket->agent_id != $user->id) {
            abort(403, 'Unauthorized access');
        }

        $lotteryTicket->load(['player', 'agent']);

        return Inertia::render('Admin/LotteryTickets/Show', [
            'ticket' => $lotteryTicket
        ]);
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, LotteryTicket $lotteryTicket)
    {
        $user = auth()->user();

        // Check access permissions
        if ($user->hasRole('Agent') && $lotteryTicket->agent_id != $user->id) {
            abort(403, 'Unauthorized access');
        }

        $request->validate([
            'payment_status' => 'required|in:pending,completed,failed',
            'payment_verified_by' => 'nullable|string'
        ]);

        $lotteryTicket->update([
            'payment_status' => $request->payment_status,
            'payment_verified_by' => $request->payment_verified_by ?? $user->user_name,
            'payment_verified_at' => now()
        ]);

        return redirect()->back()->with('success', 'Payment status updated successfully.');
    }

    /**
     * Get agent statistics
     */
    public function agentStats(Request $request)
    {
        $user = auth()->user();

        if ($user->role_id != 1) {
            abort(403, 'Only owners can view agent statistics');
        }

        $agentId = $request->get('agent_id');
        $dateFrom = $request->get('date_from', Carbon::today()->subDays(30));
        $dateTo = $request->get('date_to', Carbon::today());

        $query = LotteryTicket::whereBetween('selected_datetime', [$dateFrom, $dateTo]);

        if ($agentId) {
            $query->where('agent_id', $agentId);
        }

        $stats = $query->selectRaw('
            agent_id,
            COUNT(*) as total_tickets,
            SUM(amount) as total_amount,
            COUNT(DISTINCT player_id) as total_players,
            COUNT(CASE WHEN payment_status = "completed" THEN 1 END) as completed_payments,
            COUNT(CASE WHEN payment_status = "pending" THEN 1 END) as pending_payments,
            COUNT(CASE WHEN payment_status = "failed" THEN 1 END) as failed_payments
        ')
        ->with('agent:id,user_name,name')
        ->groupBy('agent_id')
        ->orderBy('total_amount', 'desc')
        ->get();

        return response()->json($stats);
    }
}
