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

    public function sendForReset(Request $request)
    {
        // ① バリデーション
        $request->validate([
            'tel' => 'required|string'
        ]);

        // ② ユーザー確認
        $user = User::where('tel', $request->tel)->first();

        if ($user) {
            // ③ コード生成
            $code = rand(100000, 999999);

            // ④ SMS認証テーブル更新
            SmsVerification::updateOrCreate(
                ['tel' => $request->tel],
                [
                    'code' => $code,
                    'expires_at' => now()->addMinutes(5),
                ]
            );

            // ⑤ SMS送信（本番用）
            // sendSms($request->tel, $code);

            // 開発用ログ（あとで消す）
            logger('RESET SMS CODE', [
                'tel' => $request->tel,
                'code' => $code
            ]);
        }

        // ⑥ 常に同じレスポンス（超重要）
        return response()->json([
            'message' => '認証コードを送信しました',
            'debug_code' => $code,
        ]);
    }
}
