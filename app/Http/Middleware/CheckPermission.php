<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(401, 'Authentication required.');
        }

        // Log permission check for debugging (uncomment if needed)
        // Log::info('Permission check', [
        //     'user_id' => $user->id,
        //     'roles' => $user->roles->pluck('title')->toArray(),
        //     'permissions' => $user->permissions->pluck('title')->toArray(),
        //     'checking_for' => $permission,
        // ]);

        // Owner has all permissions
        if ($user->hasRole('Owner')) {
            return $next($request);
        }

        // Check if user has the specific permission
        $requiredPermissions = explode('|', $permission);
        foreach ($requiredPermissions as $p) {
            if ($user->hasPermission(trim($p))) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized action. You do not have permission to perform this action. Please contact your administrator.');
    }
}