<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BettingAccess
{
    /**
     * Handle an incoming request - Check if user can access betting features.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(401, 'Authentication required.');
        }

        // Only Players can place bets, but Owners and Agents can view betting data
        if ($request->isMethod('post') || $request->isMethod('put') || $request->isMethod('patch')) {
            // For betting actions (placing bets), only players allowed
            if (!$user->hasRole('Player')) {
                abort(403, 'Only players can place bets.');
            }
        }

        // Check if user has betting permission
        if (!$user->hasPermission('two_digit_betting') && !$user->hasRole('Owner') && !$user->hasRole('Agent')) {
            abort(403, 'You do not have permission to access betting features.');
        }

        return $next($request);
    }
}
