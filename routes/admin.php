<?php

use App\Http\Controllers\Admin\AgentController;
use App\Http\Controllers\Admin\PlayerController;
use App\Http\Controllers\Admin\OwnerPlayerController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BannerTextController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\TopTenWithdrawController;
use App\Http\Controllers\Admin\WinnerTextController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\TwoD\TwoDigitController;
use App\Http\Controllers\Admin\OwnerDashboardController;
use App\Http\Controllers\Admin\AgentDashboardController;
use App\Http\Controllers\Admin\LotteryTicketController;
use App\Http\Controllers\PlayerDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here are the admin routes for your 2D betting game with proper middleware
| protection based on your 4-role system: Owner, Agent, Player, SystemWallet
|
*/

// Admin Authentication Routes (no middleware needed)
Route::prefix('admin')->group(function () {
    Route::get('/login', [LoginController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [LoginController::class, 'login'])->name('admin.login.post');
    Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
    Route::get('/change-password/{user}', [LoginController::class, 'showChangePassword'])->name('change-password');
    Route::post('/change-password/{user}', [LoginController::class, 'updatePassword'])->name('update-password');
    
    // Simple test route
    Route::get('/test', function () {
        return response()->json(['message' => 'Admin routes working!']);
    })->name('admin.test');
    
});

// Owner Dashboard Routes (Owner only)
Route::middleware(['auth', 'check.status', 'owner.only'])->group(function () {
    Route::get('/owner/dashboard', [OwnerDashboardController::class, 'dashboard'])->name('owner.dashboard');
    
    // Agent management routes
    Route::prefix('admin')->group(function () {
        Route::get('/agents', [AgentController::class, 'index'])->name('admin.agents.index');
        Route::get('/agents/create', [AgentController::class, 'create'])->name('admin.agents.create');
        Route::post('/agents', [AgentController::class, 'store'])->name('admin.agents.store');
        Route::get('/agents/{agent}/edit', [AgentController::class, 'edit'])->name('admin.agents.edit');
        Route::put('/agents/{agent}', [AgentController::class, 'update'])->name('admin.agents.update');
        Route::delete('/agents/{agent}', [AgentController::class, 'destroy'])->name('admin.agents.destroy');
        
        // Agent cash operations
        Route::get('/agents/{agent}/cash-in', [AgentController::class, 'getCashIn'])->name('admin.agents.cash-in');
        Route::post('/agents/{agent}/cash-in', [AgentController::class, 'makeCashIn'])->name('admin.agents.make-cash-in');
        Route::get('/agents/{agent}/cash-out', [AgentController::class, 'getCashOut'])->name('admin.agents.cash-out');
        Route::post('/agents/{agent}/cash-out', [AgentController::class, 'makeCashOut'])->name('admin.agents.make-cash-out');
        Route::get('/agents/{agent}/change-password', [AgentController::class, 'getChangePassword'])->name('admin.agents.change-password');
        Route::post('/agents/{agent}/change-password', [AgentController::class, 'makeChangePassword'])->name('admin.agents.update-password');
        Route::post('/agents/{agent}/ban', [AgentController::class, 'banAgent'])->name('admin.agents.ban');
        Route::get('/agents/{agent}/transfer-logs', [AgentController::class, 'getTransferDetail'])->name('admin.agents.transfer-logs');
        
        // Player management (Owner can see all players - read-only)
        Route::get('/owner/players', [OwnerPlayerController::class, 'index'])->name('owner.players.index');
        Route::get('/owner/players/{player}', [OwnerPlayerController::class, 'show'])->name('owner.players.show');
        Route::get('/owner/players/{player}/transfer-logs', [OwnerPlayerController::class, 'getTransferLogs'])->name('owner.players.transfer-logs');
        
        // Banner Management (Owner full control)
        Route::resource('banners', BannerController::class);
        
        // Banner Text Management (Owner full control)
        Route::resource('banner-texts', BannerTextController::class);
        
        // Promotion Management (Owner full control)
        Route::resource('promotions', PromotionController::class);
        
        // Top Ten Withdraw Management (Owner full control)
        Route::resource('top-ten-withdraws', TopTenWithdrawController::class);
        
        // Winner Text Management (Owner full control)
        Route::resource('winner-texts', WinnerTextController::class);
        
        // Reports and settings
        Route::get('/owner/reports', [OwnerDashboardController::class, 'reports'])->name('admin.owner.reports');
        Route::get('/system-settings', function () {
            return Inertia::render('admin/SystemSettings');
        })->name('admin.system.settings');
        
        // 2D Game management
        Route::get('/2d/dashboard', [TwoDigitController::class, 'dashboard'])->name('admin.2d.dashboard');
        Route::get('/2d/settings', [TwoDigitController::class, 'headCloseDigit'])->name('admin.2d.settings');
        
        // 2D Reports
        Route::get('/2d/reports', [TwoDigitController::class, 'betSlipList'])->name('admin.2d.reports');
        Route::get('/2d/reports/{slip}', [TwoDigitController::class, 'betSlipDetails'])->name('admin.2d.reports.details');
        Route::get('/2d/ledger', [TwoDigitController::class, 'dailyLedger'])->name('admin.2d.ledger');
        Route::get('/2d/winners', [TwoDigitController::class, 'dailyWinners'])->name('admin.2d.winners');
        
        // 2D Management Actions
        Route::post('/2d/limit', [TwoDigitController::class, 'storeTwoDLimit'])->name('admin.2d.limit.store');
        Route::post('/2d/result', [TwoDigitController::class, 'storeTwoDResult'])->name('admin.2d.result.store');
        
        // AJAX Endpoints
        Route::post('/2d/toggle-head-close', [TwoDigitController::class, 'toggleStatus'])->name('admin.head-close-digit.toggle-status');
        Route::post('/2d/toggle-choose-digit', [TwoDigitController::class, 'toggleChooseDigitStatus'])->name('admin.choose-close-digit.toggle-status');
        Route::post('/2d/toggle-battle', [TwoDigitController::class, 'toggleBattleStatus'])->name('admin.battle.toggle-status');
        
        // Lottery Ticket Management (Owner full control)
        Route::get('/lottery-tickets', [LotteryTicketController::class, 'index'])->name('admin.lottery-tickets.index');
        Route::get('/lottery-tickets/{lotteryTicket}', [LotteryTicketController::class, 'show'])->name('admin.lottery-tickets.show');
        Route::patch('/lottery-tickets/{lotteryTicket}/payment-status', [LotteryTicketController::class, 'updatePaymentStatus'])->name('admin.lottery-tickets.update-payment-status');
        Route::get('/lottery-tickets/agent-stats', [LotteryTicketController::class, 'agentStats'])->name('admin.lottery-tickets.agent-stats');
    });
});

// Agent Dashboard Routes (Agent only)
Route::middleware(['auth', 'check.status', 'check.role:Agent'])->group(function () {
    Route::get('/agent/dashboard', [AgentDashboardController::class, 'dashboard'])->name('agent.dashboard');
    
    // Player management for agents
    Route::prefix('admin')->group(function () {
        Route::get('/players', [PlayerController::class, 'index'])->name('admin.agent.players.index');
        Route::get('/players/create', [PlayerController::class, 'create'])->name('admin.agent.players.create');
        Route::post('/players', [PlayerController::class, 'store'])->name('admin.agent.players.store');
        Route::get('/players/{player}/edit', [PlayerController::class, 'edit'])->name('admin.agent.players.edit');
        Route::put('/players/{player}', [PlayerController::class, 'update'])->name('admin.agent.players.update');
        
        // Player cash operations
        Route::get('/players/{player}/cash-in', [PlayerController::class, 'getCashIn'])->name('admin.agent.players.cash-in');
        Route::post('/players/{player}/cash-in', [PlayerController::class, 'makeCashIn'])->name('admin.agent.players.make-cash-in');
        Route::get('/players/{player}/cash-out', [PlayerController::class, 'getCashOut'])->name('admin.agent.players.cash-out');
        Route::post('/players/{player}/cash-out', [PlayerController::class, 'makeCashOut'])->name('admin.agent.players.make-cash-out');
        Route::get('/players/{player}/change-password', [PlayerController::class, 'getChangePassword'])->name('admin.agent.players.change-password');
        Route::post('/players/{player}/change-password', [PlayerController::class, 'makeChangePassword'])->name('admin.agent.players.update-password');
        Route::post('/players/{player}/ban', [PlayerController::class, 'banUser'])->name('admin.agent.players.ban');
        Route::get('/players/{player}/transfer-logs', [PlayerController::class, 'getTransferLogs'])->name('admin.players.transfer-logs');
        
        // Agent specific features
        Route::get('/agent/transfers', [AgentDashboardController::class, 'transfers'])->name('admin.agent.transfers');
        Route::get('/agent/reports', [AgentDashboardController::class, 'reports'])->name('admin.agent.reports');
        
        // Lottery Ticket Management (Agent can see their players' tickets)
        Route::get('/lottery-tickets', [LotteryTicketController::class, 'index'])->name('admin.agent.lottery-tickets.index');
        Route::get('/lottery-tickets/{lotteryTicket}', [LotteryTicketController::class, 'show'])->name('admin.agent.lottery-tickets.show');
        Route::patch('/lottery-tickets/{lotteryTicket}/payment-status', [LotteryTicketController::class, 'updatePaymentStatus'])->name('admin.agent.lottery-tickets.update-payment-status');
    });
});


// Player Betting Routes (Players only)
Route::prefix('betting')->middleware(['auth', 'check.status', 'betting.access'])->group(function () {
    Route::get('/2d', function () {
        return view('betting.2d');
    })->name('betting.2d');
    
    Route::post('/2d/place', function () {
        // Handle 2D bet placement
    })->name('betting.2d.place');
    
    Route::get('/history', function () {
        return view('betting.history');
    })->name('betting.history');
});

// Player Dashboard Routes
Route::prefix('player')->middleware(['auth', 'check.status', 'check.role:Player'])->group(function () {
    Route::get('/dashboard', [PlayerDashboardController::class, 'dashboard'])->name('player.dashboard');
    Route::get('/betting-history', [PlayerDashboardController::class, 'bettingHistory'])->name('player.betting.history');
    Route::get('/transfers', [PlayerDashboardController::class, 'transfers'])->name('player.transfers');
});

// API Routes with Transaction Key Protection
Route::prefix('api')->middleware(['transaction.key'])->group(function () {
    Route::post('/betting/callback', function () {
        // Handle betting callbacks
    })->name('api.betting.callback');
    
    Route::post('/wallet/callback', function () {
        // Handle wallet callbacks
    })->name('api.wallet.callback');
});
