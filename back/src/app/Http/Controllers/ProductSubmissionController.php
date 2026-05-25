<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([

            'category_id' => 'required|integer',
            'color_id' => 'nullable|integer',
            'shipment_date_id' => 'required|integer',
            'size_id' => 'nullable|integer',
            'seller_id' => 'required|integer',

            'product_name' => 'required|string|max:255',

            'product_price' => 'required|integer|min:0',

            'product_description' => 'nullable|string',

            'created_by' => 'required|string|max:255',

            'image' => 'required|image|max:2048',
        ]);

        // 商品作成
        $product = Product::create([

            'category_id' => $validated['category_id'],
            'color_id' => $validated['color_id'] ?? null,
            'shipment_date_id' => $validated['shipment_date_id'],
            'size_id' => $validated['size_id'] ?? null,
            'seller_id' => $validated['seller_id'],

            'product_name' => $validated['product_name'],
            'product_price' => $validated['product_price'],
            'product_description' => $validated['product_description'] ?? null,

            'created_by' => $validated['created_by'],

            // 承認待ち
            'status' => 'inactive',
            'approve_status' => 'pending',

            // 非公開
            'is_active' => false,
        ]);

        // 画像保存
        if ($request->hasFile('image')) {

            $path = $request->file('image')
                ->store('products', 'public');

            $product->images()->create([
                'image_path' => $path,
                'sort_order' => 1,
            ]);
        }

        return response()->json([
            'message' => '商品を仮登録しました',
            'product' => $product,
        ]);
    }
}
