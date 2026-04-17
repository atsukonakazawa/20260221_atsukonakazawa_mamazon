<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\User;

class ReviewController extends Controller
{
    //レビュー一覧表示
    public function index($productId)
    {
        $reviews = Review::with('user')
            ->where('product_id', $productId)
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    // レビュー投稿可否確認
    public function create(Request $request, $productId)
    {
        try {
            // user_idをリクエストから取得
            $user = User::findOrFail($request->user_id);

            $hasDeliveredOrder = OrderItem::where('product_id', $productId)
                ->whereHas('order', function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->whereHas('shipmentStatus', function ($q) {
                            $q->where('shipment_status', 'お届け済み');
                        });
                })
                ->exists();

            if (!$hasDeliveredOrder) {
                return response()->json([
                    'message' => 'この商品はお届け後にレビュー可能です。'
                ], 403);
            }

            return response()->json([
                'message' => 'レビュー投稿が可能です。'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'サーバーエラーが発生しました。',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // レビュー保存
    public function store(Request $request)
    {
        $request->validate([
            'user_id'   => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'score'     => 'required|integer|min:1|max:5',
            'comment'   => 'required|string|max:1000',
        ]);

        // user_idをリクエストから取得
        $user = User::findOrFail($request->user_id);

        // お届け済み商品のみ投稿可能
        $hasDeliveredOrder = OrderItem::where('product_id', $request->product_id)
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->whereHas('shipmentStatus', function ($q) {
                        $q->where('shipment_status', 'お届け済み');
                    });
            })
            ->exists();

        if (!$hasDeliveredOrder) {
            return response()->json([
                'message' => 'この商品はお届け後にレビュー可能です。'
            ], 403);
        }

        // レビュー作成または更新
        Review::updateOrCreate(
            [
                'user_id'   => $user->id,
                'product_id' => $request->product_id,
            ],
            [
                'score'   => $request->score,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'レビューを投稿しました。'
        ]);
    }
}
