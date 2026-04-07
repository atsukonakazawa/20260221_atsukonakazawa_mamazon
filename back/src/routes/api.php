<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SmsAuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//チェックユーザー、アカウント登録、ログイン
Route::post('/check-user', [AuthController::class, 'checkUser']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//SMS認証
Route::post('/sms/send', [SmsAuthController::class, 'send']);
Route::post('/sms/verify', [SmsAuthController::class, 'verify']);

//商品情報取得
Route::get('/products', [
    ProductController::class, 'index'
]);
Route::get('/products/{id}', [ProductController::class, 'show']);

//カート機能 機能を完成させてから認証を追加する
//Route::middleware('auth:sanctum')->group(function () {
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::patch('/cart/{id}', [CartController::class, 'update']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);
//});

//購入
Route::post('/payment', [PaymentController::class, 'pay']);
Route::post('/order', [PaymentController::class, 'storeOrder']);
Route::get('/orders', [OrderController::class, 'index']);
