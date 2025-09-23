<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Admin\UserLog;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('admin/Login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'user_name' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $this->credentials($request);

        if (! Auth::attempt($credentials)) {
            return back()->with('error', 'The credentials do not match our records.');
        }

        $user = Auth::user();
        
        // Check if user is banned
        if ($user->status == 0) {
            Auth::logout();
            return redirect()->back()->with('error', 'Your account has been suspended. Please contact support.');
        }

        // Check if password needs to be changed
        if ($user->is_changed_password == 0) {
            return redirect()->route('change-password', $user->id);
        }

        // Log the login
        if (class_exists(\App\Models\Admin\UserLog::class)) {
            UserLog::create([
                'ip_address' => $request->ip(),
                'user_id' => $user->id,
                'user_agent' => $request->userAgent(),
            ]);
        }

        // Role-based redirect - Only Owner and Agent can access admin dashboard
        if ($user->hasRole('Owner')) {
            return redirect()->route('owner.dashboard');
        } elseif ($user->hasRole('Agent')) {
            return redirect()->route('agent.dashboard');
        } elseif ($user->hasRole('Player')) {
            // Players should use a separate player interface (not admin dashboard)
            Auth::logout();
            return redirect('/admin/login')->with('error', 'Players are not allowed to access the admin dashboard. Please use the player interface.');
        }

        // Default redirect for unknown roles
        return redirect('/admin/login');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        return redirect('/login');
    }

    public function updatePassword(Request $request, User $user)
    {
        try {
            $request->validate([
                'password' => 'required|min:6|confirmed',
            ]);

            $user->update([
                'password' => Hash::make($request->password),
                'is_changed_password' => true,
            ]);

            return redirect()->route('login')->with('success', 'Password has been Updated.');
        } catch (Exception $e) {

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    protected function credentials(Request $request)
    {
        return $request->only('user_name', 'password');
    }
}
