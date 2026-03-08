<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with([
            'category',
            'color',
            'shipmentDate',
            'size',
            'seller',
            'images'
        ])->get();

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
        ])->findOrFail($id);
    }
}
