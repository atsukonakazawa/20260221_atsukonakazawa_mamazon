<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->keyword) {
            $query->where(function ($q) use ($request) {
                $q->where('last_name', 'like', "%{$request->keyword}%")
                    ->orWhere('first_name', 'like', "%{$request->keyword}%")
                    ->orWhere('email', 'like', "%{$request->keyword}%")
                    ->orWhere('tel', 'like', "%{$request->keyword}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // active ⇄ suspended
        if ($user->status === 'active') {
            $user->status = 'suspended';
            $user->is_active = false;
        } elseif ($user->status === 'suspended') {
            $user->status = 'active';
            $user->is_active = true;
        }
        $user->save();

        return response()->json([
            'message' => 'ステータスを更新しました',
            'user' => $user,
        ]);
    }

    public function withdraw($id)
    {
        $user = User::findOrFail($id);

        $user->status = 'withdrawn';
        $user->is_active = false;
        $user->save();

        return response()->json([
            'message' => '退会処理しました'
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'tel' => 'nullable|string|max:255',
            'postcode' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'placement' => 'required|boolean',
            'place_of_placement' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => '更新しました',
            'user' => $user,
        ]);
    }
}
