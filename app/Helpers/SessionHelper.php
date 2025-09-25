<?php

namespace App\Helpers;

use Carbon\Carbon;

class SessionHelper
{
    /**
     * Get the current 2D betting session based on current time
     *
     * @return string 'morning' or 'evening'
     */
    public static function getCurrentSession(): string
    {
        $currentTime = Carbon::now();
        $currentHour = (int) $currentTime->format('H');
        $currentMinute = (int) $currentTime->format('i');
        
        // Convert current time to minutes for easier comparison
        $currentTimeInMinutes = ($currentHour * 60) + $currentMinute;
        
        // Morning session: 00:00 - 12:00
        $morningEndTime = 12 * 60; // 12:00 PM in minutes
        
        // Evening session: 12:04 - 16:30
        $eveningStartTime = (12 * 60) + 4; // 12:04 PM in minutes
        $eveningEndTime = (16 * 60) + 30; // 4:30 PM in minutes
        
        if ($currentTimeInMinutes <= $morningEndTime) {
            return 'morning';
        } elseif ($currentTimeInMinutes >= $eveningStartTime && $currentTimeInMinutes <= $eveningEndTime) {
            return 'evening';
        } else {
            // After 4:30 PM, default to evening session
            return 'evening';
        }
    }
    
    /**
     * Get the next session start time
     *
     * @return Carbon
     */
    public static function getNextSessionStart(): Carbon
    {
        $currentTime = Carbon::now();
        $currentHour = (int) $currentTime->format('H');
        $currentMinute = (int) $currentTime->format('i');
        
        $currentTimeInMinutes = ($currentHour * 60) + $currentMinute;
        
        // Morning session: 00:00 - 12:00
        $morningEndTime = 12 * 60; // 12:00 PM
        $eveningStartTime = (12 * 60) + 4; // 12:04 PM
        $eveningEndTime = (16 * 60) + 30; // 4:30 PM
        
        if ($currentTimeInMinutes <= $morningEndTime) {
            // Currently in morning session, next is evening
            return $currentTime->copy()->setTime(12, 4, 0);
        } elseif ($currentTimeInMinutes >= $eveningStartTime && $currentTimeInMinutes <= $eveningEndTime) {
            // Currently in evening session, next is tomorrow morning
            return $currentTime->copy()->addDay()->setTime(0, 0, 0);
        } else {
            // After evening session, next is tomorrow morning
            return $currentTime->copy()->addDay()->setTime(0, 0, 0);
        }
    }
    
    /**
     * Check if betting is currently open
     *
     * @return bool
     */
    public static function isBettingOpen(): bool
    {
        $currentTime = Carbon::now();
        $currentHour = (int) $currentTime->format('H');
        $currentMinute = (int) $currentTime->format('i');
        
        $currentTimeInMinutes = ($currentHour * 60) + $currentMinute;
        
        // Morning session: 00:00 - 12:00
        $morningEndTime = 12 * 60; // 12:00 PM
        $eveningStartTime = (12 * 60) + 4; // 12:04 PM
        $eveningEndTime = (16 * 60) + 30; // 4:30 PM
        
        return ($currentTimeInMinutes <= $morningEndTime) || 
               ($currentTimeInMinutes >= $eveningStartTime && $currentTimeInMinutes <= $eveningEndTime);
    }
    
    /**
     * Get session display name
     *
     * @param string $session
     * @return string
     */
    public static function getSessionDisplayName(string $session): string
    {
        return match($session) {
            'morning' => 'Morning Session (9:00 AM - 12:00 PM)',
            'evening' => 'Evening Session (12:04 PM - 4:30 PM)',
            default => 'Unknown Session'
        };
    }
}
