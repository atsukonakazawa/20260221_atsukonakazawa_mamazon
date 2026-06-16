<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');

        $query = Product::with([
            'category',
            'color',
            'shipmentDate',
            'size',
            'seller',
            'images'
        ])
            ->where('status', 'active')
            ->where('is_active', true)
            ->withAvg('reviews', 'score')
            ->withCount('reviews');

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {

                //productsテーブル
                $q->where('product_name', 'LIKE', "%{$keyword}%")
                    ->orWhere('product_price', 'LIKE', "%{$keyword}%")
                    ->orWhere('product_description', 'LIKE', "%{$keyword}%")

                    //categoryマスタ
                    ->orWhereHas('category', function ($q2) use ($keyword) {
                        $q2->where('category_name', 'LIKE', "%{$keyword}%");
                    })

                    // colorマスタ
                    ->orWhereHas('color', function ($q2) use ($keyword) {
                        $q2->where('color_name', 'LIKE', "%{$keyword}%");
                    })

                    // shipmentDateマスタ
                    ->orWhereHas('shipmentDate', function ($q2) use ($keyword) {
                        $q2->where(
                            'shipment_date',
                            'LIKE',
                            "%{$keyword}%"
                        );
                    })

                    // sizeマスタ
                    ->orWhereHas('size', function ($q2) use ($keyword) {
                        $q2->where('size_name', 'LIKE', "%{$keyword}%");
                    })

                    // seller
                    ->orWhereHas('seller', function ($q2) use ($keyword) {
                        $q2->where('seller_name', 'LIKE', "%{$keyword}%");
                    });
            });
        }

        $products = $query->get();

        return response()->json($products);
    }

    public function show($id)
    {
        return Product::with([
            'category',
            'color',
            'size',
            'seller',
            'shipmentDate',
            'images'
        ])
            ->where('status', 'active')
            ->where('is_active', true)
            ->withAvg('reviews', 'score')
            ->withCount('reviews')
            ->findOrFail($id);
    }
}
