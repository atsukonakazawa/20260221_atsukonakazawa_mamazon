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

        // 電話番号のレコード取得
        $record = SmsVerification::where('tel', $request->tel)->first();

        // レコードなし
        if (!$record) {
            return response()->json([
                'message' => '認証コードが正しくありません'
            ], 422);
        }

        // コード不一致
        if ($record->code !== $request->code) {
            return response()->json([
                'message' => '認証コードが正しくありません'
            ], 422);
        }

        // 有効期限切れ
        if (now()->greaterThan($record->expires_at)) {
            return response()->json([
                'message' => '認証コードの有効期限が切れています'
            ], 422);
        }

        //verify成功後に認証コードを削除
        $record->delete();

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
        // ユーザーレコードなしの場合
        $code = null;

        if ($user) {
            // ③ コード生成
            $code = rand(100000, 999999);

            // ④ SMS認証テーブル更新
            SmsVerification::updateOrCreate(
                ['tel' => $request->tel],
                [
                    'code' => $code,
                    'expires_at' => now()->addMinutes(1),
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
