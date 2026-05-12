<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Seller;


class SellerController extends Controller
{
    public function index(Request $request)
    {
        $query = Seller::query();

        if ($request->keyword) {
            $query->where(function ($q) use ($request) {
                $q->where('seller_name', 'like', "%{$request->keyword}%")
                    ->orWhere('address', 'like', "%{$request->keyword}%")
                    ->orWhere('tel', 'like', "%{$request->keyword}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $seller = Seller::findOrFail($id);
        return response()->json($seller);
    }

    public function toggleStatus($id)
    {
        $seller = Seller::findOrFail($id);

        // active ⇄ suspended
        if ($seller->status === 'active') {
            $seller->status = 'suspended';
            $seller->is_active = false;
        } elseif ($seller->status === 'suspended') {
            $seller->status = 'active';
            $seller->is_active = true;
        }
        $seller->save();

        return response()->json([
            'message' => 'ステータスを更新しました',
            'seller' => $seller,
        ]);
    }

    public function delete($id)
    {
        $seller = Seller::findOrFail($id);

        $seller->status = 'withdrawn';
        $seller->is_active = false;
        $seller->save();

        return response()->json([
            'message' => '削除処理しました'
        ]);
    }

    public function update(Request $request, $id)
    {
        $seller = Seller::findOrFail($id);

        $validated = $request->validate([
            'seller_name' => 'required|string|max:255',
            'tel' => 'nullable|string|max:255',
            'postcode' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $seller->update($validated);

        return response()->json([
            'message' => '更新しました',
            'seller' => $seller,
        ]);
    }
}
