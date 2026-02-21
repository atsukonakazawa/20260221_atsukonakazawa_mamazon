<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SmsVerification;
use App\Models\User;


class SmsAuthController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'tel' => 'required|string'
        ]);

        $code = rand(100000, 999999);

        SmsVerification::updateOrCreate(
            ['tel' => $request->tel],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(5),
            ]
        );

        // 🔰 開発用：コードを返す
        return response()->json([
            'message' => '認証コードを発行しました',
            'debug_code' => $code,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'tel' => 'required|string',
            'code' => 'required|string',
        ]);

        $record = SmsVerification::where('tel', $request->tel)
            ->where('code', $request->code)
            ->where('expires_at', '>=', now())
            ->first();

        if (!$record) {
            return response()->json([
                'message' => '認証コードが正しくありません'
            ], 422);
        }

        $user = User::where('tel', $request->tel)->first();
        logger('USER FOUND?', ['user' => $user]);

        return response()->json([
            'success' => true,
            'message' => '認証成功'
        ]);
    }
}
