<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LotteryTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'player_user_name',
        'selected_digit',
        'amount',
        'selected_datetime',
        'payment_status',
        'payment_method',
        'payment_reference',
        'payment_completed_at',
        'payment_image',
        'payment_verified_by',
        'payment_verified_at'
    ];

    protected $casts = [
        'selected_datetime' => 'datetime',
        'payment_completed_at' => 'datetime',
        'amount' => 'decimal:2'
    ];

    /**
     * Scope for pending payments
     */
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    /**
     * Scope for completed payments
     */
    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    /**
     * Scope for today's tickets
     */
    public function scopeToday($query)
    {
        return $query->whereDate('selected_datetime', Carbon::today());
    }

    /**
     * Scope for specific player
     */
    public function scopeForPlayer($query, $playerId)
    {
        return $query->where('player_id', $playerId);
    }

    /**
     * Scope for specific date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('selected_datetime', [$startDate, $endDate]);
    }

    /**
     * Accessor for formatted amount
     */
    public function getFormattedAmountAttribute()
    {
        return number_format($this->amount, 0) . ' ကျပ်';
    }

    /**
     * Accessor for Myanmar time
     */
    public function getMyanmarTimeAttribute()
    {
        return $this->selected_datetime->setTimezone('Asia/Yangon')->format('d/m/Y H:i:s');
    }

    /**
     * Accessor for formatted payment status
     */
    public function getFormattedPaymentStatusAttribute()
    {
        return match($this->payment_status) {
            'pending' => 'စောင့်ဆိုင်းနေသည်',
            'completed' => 'ပြီးစီးပါပြီ',
            'failed' => 'မအောင်မြင်ပါ',
            default => $this->payment_status
        };
    }

    /**
     * Relationship with user (if you have a users table)
     */
    public function player()
    {
        return $this->belongsTo(User::class, 'player_id');
    }

    /**
     * Get total amount for a player on a specific date
     */
    public static function getPlayerTotalAmount($playerId, $date = null)
    {
        $query = static::where('player_id', $playerId);
        
        if ($date) {
            $query->whereDate('selected_datetime', $date);
        }
        
        return $query->sum('amount');
    }

    /**
     * Get today's statistics
     */
    public static function getTodayStats()
    {
        return static::today()
            ->selectRaw('
                COUNT(*) as total_tickets,
                SUM(amount) as total_amount,
                COUNT(DISTINCT player_id) as total_players,
                COUNT(CASE WHEN payment_status = "completed" THEN 1 END) as completed_payments,
                COUNT(CASE WHEN payment_status = "pending" THEN 1 END) as pending_payments,
                COUNT(CASE WHEN payment_status = "failed" THEN 1 END) as failed_payments
            ')
            ->first();
    }
}
