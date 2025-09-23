<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserStatus
{
    /**
     * Handle an incoming request - Check if user is active and not banned.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if (!$user) {
            return $next($request); // Let auth middleware handle this
        }

        // Check if user is banned (status = 0)
        if ($user->status == 0) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Your account has been suspended. Please contact support.');
        }

        // Check if user needs to change password
        if ($user->is_changed_password == 0) {
            return redirect()->route('change-password', $user->id);
        }

        return $next($request);
    }
}
