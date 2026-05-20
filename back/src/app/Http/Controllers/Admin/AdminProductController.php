<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Color;
use App\Models\ShipmentDate;
use App\Models\Size;
use App\Models\Seller;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'category',
            'shipmentDate',
            'seller',
        ]);

        if ($request->keyword) {
            $query->where(function ($q) use ($request) {
                $q->where('product_name', 'like', "%{$request->keyword}%")
                    ->orWhere('product_price', 'like', "%{$request->keyword}%");
            });
        }

        $products = $query->orderBy('updated_at', 'desc')->get();

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with([
            'category',
            'color',
            'shipmentDate',
            'size',
            'seller',
            'images',
        ])->findOrFail($id);
        return response()->json($product);
    }

    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);

        // active ⇄ suspended
        if ($product->status === 'active') {
            $product->status = 'suspended';
            $product->is_active = false;
        } elseif ($product->status === 'suspended') {
            $product->status = 'active';
            $product->is_active = true;
        }
        $product->save();

        return response()->json([
            'message' => 'ステータスを更新しました',
            'seller' => $product,
        ]);
    }

    public function formOptions()
    {
        return response()->json([
            'categories' => Category::select('id', 'category_name')->get(),
            'colors' => Color::select('id', 'color_name')->get(),
            'shipment_dates' => ShipmentDate::select('id', 'shipment_date')->get(),
            'sizes' => Size::select('id', 'size_name')->get(),
            'sellers' => Seller::select('id', 'seller_name')->get(),
        ]);
    }

    public function delete($id)
    {
        $product = Product::findOrFail($id);

        $product->status = 'withdrawn';
        $product->is_active = false;
        $product->save();

        return response()->json([
            'message' => '削除処理しました'
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|integer',
            'color_id' => 'nullable|integer',
            'shipment_date_id' => 'required|integer',
            'size_id' => 'nullable|integer',
            'seller_id' => 'required|integer',
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|integer|min:0',
            'product_description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $product->update($validated);
        if ($request->hasFile('image')) {

            $path = $request->file('image')
                ->store('products', 'public');

            // 既存画像をstorageから削除
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            // 既存画像をDBから削除
            $product->images()->delete();

            // 新画像保存
            $product->images()->create([
                'image_path' => $path,
                'sort_order' => 1,
            ]);
        }

        return response()->json([
            'message' => '更新しました',
            'product' => $product,
        ]);
    }
}
