<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function checkUser(Request $request)
    {
        $request->validate([
            'email' => 'required',
        ]);

        $exists = User::where('email', $request->email)
            ->orWhere('tel', $request->email)
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email'      => 'required',
            'password'   => 'required|min:8',
            'first_name' => 'required',
            'last_name'  => 'required',
            'postcode' => 'nullable',
            'address' => 'nullable',
            'date_of_birth' => 'nullable|date',
            'placement' => 'boolean',
        ]);

        //bcryptをつけることでパスワードがハッシュ化
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'tel'        => $request->tel,
            'postcode'   => $request->postcode,
            'address'    => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'placement'  => $request->placement ?? false,
            'place_of_placement' => $request->place_of_placement,
            'password'   => bcrypt($request->password),
            'sms_verified_at' => now(),
        ]);

        return response()->json([
            'message' => '登録成功',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ]);

        // email / phone 判定
        $field = filter_var($request->email, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'tel';

        // 認証失敗の場合
        if (!Auth::attempt([
            $field => $request->email,
            'password' => $request->password,
        ])) {
            return response()->json([
                'message' => 'ログイン失敗',
            ], 401);
        }

        // ユーザー取得
        $user = Auth::user();;

        // 🚫 SMS未認証チェック
        if (is_null($user->sms_verified_at)) {
            Auth::logout();
            return response()->json([
                'message' => 'SMS認証が完了していません'
            ], 403);
        }

        // ✅ ログイン成功
        return response()->json([
            'message' => 'ログイン成功',
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'message' => '未認証'
            ], 401);
        }

        $request->validate([
            'last_name'  => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'postcode'   => 'nullable|string|max:7',
            'address'    => 'nullable|string|max:255',
            'tel' => 'nullable|string|max:20',
            'placement' => 'nullable|boolean',
            'place_of_placement' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
        ]);

        $user->update([
            'last_name'  => $request->last_name,
            'first_name' => $request->first_name,
            'postcode'   => $request->postcode,
            'address'    => $request->address,
            'tel' => $request->tel,
            'placement' => $request->placement,
            'place_of_placement' => $request->place_of_placement,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }

        return response()->json($user);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'tel' => 'required',
            'password' => 'required|min:6',
        ]);

        $user = User::where('tel', $request->tel)->firstOrFail();

        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json(['message' => 'ok']);
    }
}
