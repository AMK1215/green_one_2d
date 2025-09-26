<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLotteryTicketRequest;
use App\Http\Requests\UpdateLotteryTicketRequest;
use App\Models\LotteryTicket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LotteryTicketController extends Controller
{
    /**
     * Store lottery tickets
     */
    public function store(StoreLotteryTicketRequest $request): JsonResponse
    {
        try {
            // Log the incoming request for debugging
            Log::info('Lottery ticket creation request received', [
                'player_id' => $request->player_id,
                'player_user_name' => $request->player_user_name,
                'selected_digits_count' => count($request->selected_digits),
                'amount_per_ticket' => $request->amount_per_ticket,
                'selected_datetime' => $request->selected_datetime,
                'has_payment_image' => $request->hasFile('payment_image'),
                'payment_method' => $request->payment_method,
                'payment_reference' => $request->payment_reference
            ]);

            DB::beginTransaction();

            $tickets = [];
            $totalAmount = 0;
            $paymentImagePath = null;

            // Handle payment image upload if provided
            if ($request->hasFile('payment_image')) {
                $image = $request->file('payment_image');
                $imageName = 'payment_' . time() . '_' . $request->player_id . '.' . $image->getClientOriginalExtension();
                $paymentImagePath = $image->storeAs('payment_images', $imageName, 'public');
            }

            // Create individual tickets for each selected digit
            foreach ($request->selected_digits as $digit) {
                $ticket = LotteryTicket::create([
                    'player_id' => $request->player_id,
                    'player_user_name' => $request->player_user_name,
                    'selected_digit' => $digit,
                    'amount' => $request->amount_per_ticket,
                    'selected_datetime' => Carbon::parse($request->selected_datetime)->setTimezone('Asia/Yangon'),
                    'payment_status' => $paymentImagePath ? 'completed' : 'pending',
                    'payment_method' => $request->payment_method ?? 'kpay',
                    'payment_reference' => $request->payment_reference ?? 'KPAY_' . time(),
                    'payment_image' => $paymentImagePath,
                    'payment_completed_at' => $paymentImagePath ? Carbon::now() : null
                ]);

                $tickets[] = [
                    'id' => $ticket->id,
                    'selected_digit' => $ticket->selected_digit,
                    'amount' => $ticket->amount,
                    'payment_status' => $ticket->payment_status,
                    'payment_image' => $ticket->payment_image,
                    'created_at' => $ticket->created_at->toISOString()
                ];

                $totalAmount += $request->amount_per_ticket;
            }

            DB::commit();

            Log::info('Lottery tickets created successfully', [
                'player_id' => $request->player_id,
                'player_user_name' => $request->player_user_name,
                'total_tickets' => count($tickets),
                'total_amount' => $totalAmount,
                'payment_image_uploaded' => $paymentImagePath ? true : false
            ]);

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Lottery tickets created successfully.',
                'data' => [
                    'tickets' => $tickets,
                    'total_tickets' => count($tickets),
                    'total_amount' => $totalAmount,
                    'payment_status' => $paymentImagePath ? 'completed' : 'pending',
                    'payment_image' => $paymentImagePath
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to create lottery tickets', [
                'error' => $e->getMessage(),
                'player_id' => $request->player_id ?? null,
                'player_user_name' => $request->player_user_name ?? null
            ]);
            
            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to create lottery tickets: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Get player's tickets
     */
    public function getPlayerTickets(Request $request): JsonResponse
    {
        $request->validate([
            'player_id' => 'required|integer',
            'date' => 'nullable|date',
            'status' => 'nullable|in:pending,completed,failed',
            'limit' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        try {
            $query = LotteryTicket::forPlayer($request->player_id);

            if ($request->date) {
                $query->whereDate('selected_datetime', $request->date);
            }

            if ($request->status) {
                $query->where('payment_status', $request->status);
            }

            $limit = $request->limit ?? 20;
            $page = $request->page ?? 1;

            $tickets = $query->orderBy('selected_datetime', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            $totalCount = LotteryTicket::forPlayer($request->player_id)
                ->when($request->date, function($q) use ($request) {
                    return $q->whereDate('selected_datetime', $request->date);
                })
                ->when($request->status, function($q) use ($request) {
                    return $q->where('payment_status', $request->status);
                })
                ->count();

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Player tickets retrieved successfully.',
                'data' => [
                    'tickets' => $tickets,
                    'pagination' => [
                        'current_page' => $page,
                        'per_page' => $limit,
                        'total' => $totalCount,
                        'last_page' => ceil($totalCount / $limit)
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve player tickets', [
                'error' => $e->getMessage(),
                'player_id' => $request->player_id
            ]);

            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to retrieve player tickets: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(UpdateLotteryTicketRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $tickets = LotteryTicket::whereIn('id', $request->ticket_ids)->get();

            if ($tickets->isEmpty()) {
                return response()->json([
                    'status' => 'Request failed.',
                    'message' => 'No tickets found with the provided IDs.',
                    'data' => null
                ], 404);
            }

            $updatedTickets = [];

            foreach ($tickets as $ticket) {
                $updateData = [
                    'payment_status' => $request->payment_status,
                    'payment_method' => $request->payment_method,
                    'payment_reference' => $request->payment_reference,
                    'payment_completed_at' => $request->payment_status === 'completed' ? Carbon::now() : null
                ];

                // Handle payment image upload if provided
                if ($request->hasFile('payment_image')) {
                    $image = $request->file('payment_image');
                    $imageName = 'payment_' . time() . '_' . $ticket->id . '.' . $image->getClientOriginalExtension();
                    $imagePath = $image->storeAs('payment_images', $imageName, 'public');
                    $updateData['payment_image'] = $imagePath;
                }

                $ticket->update($updateData);

                $updatedTickets[] = [
                    'id' => $ticket->id,
                    'selected_digit' => $ticket->selected_digit,
                    'amount' => $ticket->amount,
                    'payment_status' => $ticket->payment_status,
                    'payment_method' => $ticket->payment_method,
                    'payment_reference' => $ticket->payment_reference,
                    'payment_image' => $ticket->payment_image,
                    'updated_at' => $ticket->updated_at->toISOString()
                ];
            }

            DB::commit();

            Log::info('Payment status updated successfully', [
                'ticket_ids' => $request->ticket_ids,
                'payment_status' => $request->payment_status,
                'updated_count' => count($updatedTickets)
            ]);

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Payment status updated successfully.',
                'data' => [
                    'updated_tickets' => $updatedTickets,
                    'updated_count' => count($updatedTickets),
                    'payment_status' => $request->payment_status
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to update payment status', [
                'error' => $e->getMessage(),
                'ticket_ids' => $request->ticket_ids ?? null
            ]);
            
            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to update payment status: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Get today's lottery statistics
     */
    public function getTodayStats(): JsonResponse
    {
        try {
            $stats = LotteryTicket::getTodayStats();

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Today\'s lottery statistics retrieved successfully.',
                'data' => [
                    'total_tickets' => (int) $stats->total_tickets,
                    'total_amount' => (float) $stats->total_amount,
                    'total_players' => (int) $stats->total_players,
                    'completed_payments' => (int) $stats->completed_payments,
                    'pending_payments' => (int) $stats->pending_payments,
                    'failed_payments' => (int) $stats->failed_payments,
                    'date' => Carbon::today()->format('Y-m-d')
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve today\'s statistics', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Get lottery statistics for date range
     */
    public function getStatsByDateRange(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        try {
            $stats = LotteryTicket::dateRange($request->start_date, $request->end_date)
                ->selectRaw('
                    COUNT(*) as total_tickets,
                    SUM(amount) as total_amount,
                    COUNT(DISTINCT player_id) as total_players,
                    COUNT(CASE WHEN payment_status = "completed" THEN 1 END) as completed_payments,
                    COUNT(CASE WHEN payment_status = "pending" THEN 1 END) as pending_payments,
                    COUNT(CASE WHEN payment_status = "failed" THEN 1 END) as failed_payments
                ')
                ->first();

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Date range statistics retrieved successfully.',
                'data' => [
                    'total_tickets' => (int) $stats->total_tickets,
                    'total_amount' => (float) $stats->total_amount,
                    'total_players' => (int) $stats->total_players,
                    'completed_payments' => (int) $stats->completed_payments,
                    'pending_payments' => (int) $stats->pending_payments,
                    'failed_payments' => (int) $stats->failed_payments,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve date range statistics', [
                'error' => $e->getMessage(),
                'start_date' => $request->start_date,
                'end_date' => $request->end_date
            ]);

            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Delete lottery tickets (admin only)
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'ticket_ids' => 'required|array|min:1',
            'ticket_ids.*' => 'integer|exists:lottery_tickets,id'
        ]);

        try {
            DB::beginTransaction();

            $deletedCount = LotteryTicket::whereIn('id', $request->ticket_ids)->delete();

            DB::commit();

            Log::info('Lottery tickets deleted successfully', [
                'ticket_ids' => $request->ticket_ids,
                'deleted_count' => $deletedCount
            ]);

            return response()->json([
                'status' => 'Request was successful.',
                'message' => 'Lottery tickets deleted successfully.',
                'data' => [
                    'deleted_count' => $deletedCount
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to delete lottery tickets', [
                'error' => $e->getMessage(),
                'ticket_ids' => $request->ticket_ids
            ]);
            
            return response()->json([
                'status' => 'Request failed.',
                'message' => 'Failed to delete lottery tickets: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
