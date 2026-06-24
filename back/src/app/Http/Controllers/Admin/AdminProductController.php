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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
            // 複数画像対応
            'new_images.*' => 'nullable|image|max:2048',
            // 削除画像ID
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'integer',
        ]);

        // 商品更新
        $product->update([
            'category_id' => $validated['category_id'],
            'color_id' => $validated['color_id'] ?? null,
            'shipment_date_id' => $validated['shipment_date_id'],
            'size_id' => $validated['size_id'] ?? null,
            'seller_id' => $validated['seller_id'],
            'product_name' => $validated['product_name'],
            'product_price' => $validated['product_price'],
            'product_description' => $validated['product_description'] ?? null,
        ]);

        // 画像削除
        if ($request->filled('deleted_image_ids')) {

            $imagesToDelete = $product->images()
                ->whereIn('id', $request->deleted_image_ids)
                ->get();

            foreach ($imagesToDelete as $image) {

                // storage削除
                //Storage::disk('public')->delete($image->image_path);
                //Cloudinary画像の削除は後で対応

                // DB削除
                $image->delete();
            }
        }

        // 新画像追加
        if ($request->hasFile('new_images')) {

            foreach ($request->file('new_images') as $index => $file) {

                $uploaded = Cloudinary::upload(
                    $file->getRealPath(),
                    [
                        'folder' => 'products',
                    ]
                );

                $imageUrl = $uploaded->getSecurePath();

                $product->images()->create([
                    'image_path' => $imageUrl,
                    'sort_order' => $product->images()->count() + $index + 1,
                ]);
            }
        }

        return response()->json([
            'message' => '更新しました',
            'product' => $product->load('images'),
        ]);
    }

    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'approved_by' => 'required|string|max:255',
        ]);

        $product = Product::findOrFail($id);

        // inactiveのみ承認可能
        if ($product->status !== 'inactive') {
            return response()->json([
                'message' => '承認待ち商品ではありません'
            ], 422);
        }

        $product->update([
            'status' => 'active',
            'is_active' => true,
            'approved_by' => $validated['approved_by'],
            'approved_at' => now(),
        ]);

        return response()->json([
            'message' => '承認しました',
        ]);
    }
}
