<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SmsAuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SellerController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\ProductSubmissionController;
use App\Http\Controllers\Admin\AdminOrderController;

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
Route::post('/check-email', [AuthController::class, 'checkEmail']);
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

//カート機能
//機能を完成させてから認証を追加する
//Route::middleware('auth:sanctum')->group(function () {
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::patch('/cart/{id}', [CartController::class, 'update']);
Route::delete('/cart/clear', [CartController::class, 'clear']);

//レビュー
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/create/{productId}', [ReviewController::class, 'create']);
Route::post('/reviews', [ReviewController::class, 'store']);

//購入
Route::get('/payment-ways', [PaymentController::class, 'getPaymentWays']);
Route::post('/payment', [PaymentController::class, 'pay']);
Route::post('/order', [PaymentController::class, 'storeOrder']);
Route::get('/orders', [OrderController::class, 'index']);

//アカウント情報の変更
Route::put('/user', [AuthController::class, 'update']);
Route::post('/sms/send-for-reset', [SmsAuthController::class, 'sendForReset']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

//商品仮登録
Route::post(
    '/product-submissions',
    [ProductSubmissionController::class, 'store']
);

//管理画面 ユーザー管理
Route::get('/admin/users', [UserController::class, 'index']);
Route::get('/admin/users/{id}', [UserController::class, 'show']);
Route::patch('/admin/users/{id}/status', [UserController::class, 'toggleStatus']);
Route::patch('/admin/users/{id}/withdraw', [UserController::class, 'withdraw']);
Route::put('/admin/users/{id}', [UserController::class, 'update']);

//管理画面 販売者管理
Route::get('/admin/sellers', [SellerController::class, 'index']);
Route::get('/admin/sellers/{id}', [SellerController::class, 'show']);
Route::patch('/admin/sellers/{id}/status', [SellerController::class, 'toggleStatus']);
Route::delete('/admin/sellers/{id}', [SellerController::class, 'delete']);
Route::put('/admin/sellers/{id}', [SellerController::class, 'update']);
Route::post('/admin/sellers', [SellerController::class, 'store']);

//管理画面 商品管理
Route::get(
    '/admin/products/form-options',
    [AdminProductController::class, 'formOptions']
);
Route::get('/admin/products', [AdminProductController::class, 'index']);
Route::get('/admin/products/{id}', [AdminProductController::class, 'show']);
Route::patch('/admin/products/{id}/status', [AdminProductController::class, 'toggleStatus']);
Route::patch('/admin/products/{id}/approve', [AdminProductController::class, 'approve']);
Route::delete('/admin/products/{id}', [AdminProductController::class, 'delete']);
Route::put('/admin/products/{id}', [AdminProductController::class, 'update']);

// 管理画面 注文管理
Route::get(
    '/admin/orders',
    [AdminOrderController::class, 'index']
);
Route::get(
    '/admin/orders/{order}',
    [AdminOrderController::class, 'show']
);

//});