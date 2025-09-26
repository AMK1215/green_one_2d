<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Player\GameLogController;
use App\Http\Controllers\Api\Player\TransactionController;
use App\Http\Controllers\Api\ThreeDController;
use App\Http\Controllers\Api\V1\Auth\AuthController;

use App\Http\Controllers\Api\V1\Bank\BankController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\V1\ContactController;

use App\Http\Controllers\Api\V1\DepositRequestController;

use App\Http\Controllers\Api\V1\Game\GameController;
use App\Http\Controllers\Api\V1\Game\GSCPlusProviderController;
use App\Http\Controllers\Api\V1\Game\LaunchGameController;
use App\Http\Controllers\Api\V1\Game\ProviderLaunchGameController;

use App\Http\Controllers\Api\V1\Shan\ShanLaunchGameController;

use App\Http\Controllers\Api\V1\gplus\Webhook\DepositController;
use App\Http\Controllers\Api\V1\gplus\Webhook\GameListController;
use App\Http\Controllers\Api\V1\gplus\Webhook\GetBalanceController;
use App\Http\Controllers\Api\V1\gplus\Webhook\ProductListController;
use App\Http\Controllers\Api\V1\gplus\Webhook\PushBetDataController;
use App\Http\Controllers\Api\V1\gplus\Webhook\WithdrawController;

use App\Http\Controllers\Api\V1\PromotionController;
use App\Http\Controllers\Api\V1\Shan\ShanGetBalanceController;
use App\Http\Controllers\Api\V1\Shan\ShanTransactionController;
use App\Http\Controllers\Api\V1\TwoDigit\TwoDigitBetController;
use App\Http\Controllers\Api\V1\WithDrawRequestController;
use App\Http\Controllers\Api\V1\Shan\ShankomeeGetBalanceController;
use App\Http\Controllers\Api\V1\Shan\BalanceUpdateCallbackController;
use App\Http\Controllers\Api\PoneWine\GameMatchController;
use App\Http\Controllers\Api\PoneWine\PoneWineClientBalanceUpdateController;
use App\Http\Controllers\Api\PoneWine\PoneWineLaunchGameController;

use App\Http\Controllers\Api\LotteryTicketController;






Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/player-change-password', [AuthController::class, 'playerChangePassword']);
Route::post('/logout', [AuthController::class, 'logout']);

// slot route 
Route::prefix('v1/api/seamless')->group(function () {
    Route::post('balance', [GetBalanceController::class, 'getBalance']);
    Route::post('withdraw', [WithdrawController::class, 'withdraw']);
    Route::post('deposit', [DepositController::class, 'deposit']);
    Route::post('pushbetdata', [PushBetDataController::class, 'pushBetData']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {

    // user api
    Route::get('user', [AuthController::class, 'getUser']);
    Route::get('/banks', [GSCPlusProviderController::class, 'banks']);
    // fanicial api
    Route::get('agentfinicialPaymentType', [BankController::class, 'all']);
    Route::post('depositfinicial', [DepositRequestController::class, 'FinicialDeposit']);
    Route::get('depositlogfinicial', [DepositRequestController::class, 'log']);
    Route::get('paymentTypefinicial', [GSCPlusProviderController::class, 'paymentType']);
    Route::post('withdrawfinicial', [WithDrawRequestController::class, 'FinicalWithdraw']);
    Route::get('withdrawlogfinicial', [WithDrawRequestController::class, 'log']);

    // Player game logs
   
    Route::get('user', [AuthController::class, 'getUser']);

    // 2d route
    Route::post('/twod-bet', [TwoDigitBetController::class, 'store']);
    Route::get('/twod-bet-slips', [TwoDigitBetController::class, 'myBetSlips']);
    // evening-twod-bet-slips
    Route::get('/evening-twod-bet-slips', [TwoDigitBetController::class, 'eveningSessionSlip']);
    Route::get('/two-d-daily-winners', [TwoDigitBetController::class, 'dailyWinners']);

    // 3D routes
    
   

});

Route::get('winnerText', [BannerController::class, 'winnerText']);
Route::get('banner_Text', [BannerController::class, 'bannerText']);

Route::get('banner', [BannerController::class, 'index']);
Route::get('videoads', [BannerController::class, 'ApiVideoads']);
Route::get('toptenwithdraw', [BannerController::class, 'TopTen']);
Route::get('contact', [ContactController::class, 'get']);
Route::get('promotion', [PromotionController::class, 'index']);



// Public routes (no authentication required)
Route::middleware('auth:sanctum')->group(function () {
Route::prefix('lottery')->group(function () {
    // Store lottery tickets
    Route::post('/tickets', [LotteryTicketController::class, 'store']);
    
    // Get player's tickets
    Route::get('/tickets/player/{player_id}', [LotteryTicketController::class, 'getPlayerTickets']);
    
    // Update payment status
    Route::patch('/tickets/payment-status', [LotteryTicketController::class, 'updatePaymentStatus']);
    
    // Get today's statistics
    Route::get('/stats/today', [LotteryTicketController::class, 'getTodayStats']);
    
    // Get statistics for date range
    Route::get('/stats/date-range', [LotteryTicketController::class, 'getStatsByDateRange']);
});
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('lottery')->group(function () {
        // Store lottery tickets (authenticated)
        Route::post('/tickets/auth', [LotteryTicketController::class, 'store']);
        
        // Get my tickets (authenticated)
        Route::get('/tickets/my-tickets', [LotteryTicketController::class, 'getPlayerTickets']);
        
        // Update payment status (authenticated)
        Route::patch('/tickets/payment-status/auth', [LotteryTicketController::class, 'updatePaymentStatus']);
        
        // Delete tickets (admin only)
        Route::delete('/tickets', [LotteryTicketController::class, 'destroy']);
    });
});