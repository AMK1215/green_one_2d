<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request to check if user has required role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles  Pipe-separated list of roles (e.g., 'Owner|Agent')
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $roles)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(401, 'Authentication required.');
        }

        $allowedRoles = explode('|', $roles);
        
        foreach ($allowedRoles as $role) {
            if ($user->hasRole(trim($role))) {
                return $next($request);
            }
        }

        abort(403, 'Access denied. You do not have the required role to access this resource.');
    }
}
