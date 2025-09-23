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


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/player-change-password', [AuthController::class, 'playerChangePassword']);
Route::post('/logout', [AuthController::class, 'logout']);

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



