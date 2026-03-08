<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SmsAuthController;
//use App\Models\Product;
use App\Http\Controllers\ProductController;


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
