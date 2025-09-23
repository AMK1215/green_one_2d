<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerOnly
{
    /**
     * Handle an incoming request - Owner only access.
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

        if (!$user->hasRole('Owner')) {
            abort(403, 'Access denied. Owner access required.');
        }

        return $next($request);
    }
}
