<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | ブラウザから別オリジンへのリクエストを許可するための設定。
    | ※ 今回の構成では
    |   ブラウザ → Next.js(3000)
    |   Next.js → Laravel(API)
    |   という構成のため、CORSは主に「保険的」な役割。
    |
    */

    /*
        | CORS を適用するパス
        | api/* とすることで API のみに限定
        |（/ や /admin などには適用されない）
     */
    'paths' => ['api/*'],

    /*
        | 許可する HTTP メソッド
        | 開発中は * で問題なし
        | 本番では ['GET','POST'] などに絞ることも可能
     */
    'allowed_methods' => ['*'],

    /*
        | 許可するオリジン（アクセス元）
        | 開発環境の Next.js（localhost:3000）のみ許可
        |
        | ※ route.ts を使わず、
        |   ブラウザ → Laravel 直接通信する場合にも必要
     */
    'allowed_origins' => ['http://localhost:3000'],

    /*
        | 正規表現でのオリジン指定
        | 今回は使用しないため空配列
     */
    'allowed_origins_patterns' => [],

    /*
        | 許可するリクエストヘッダー
        | Content-Type, Authorization 等を含めるため * にしている
     */
    'allowed_headers' => ['*'],

    /*
        | ブラウザ側に公開するレスポンスヘッダー
        | 今回は特に不要
        | （Sanctum + Cookie 認証時は XSRF-TOKEN を追加することあり）
     */
    'exposed_headers' => [],

    /*
        | プリフライトリクエスト（OPTIONS）のキャッシュ秒数
        | 0 = キャッシュしない（開発中は問題なし）
     */
    'max_age' => 0,

    /*
        | Cookie を含むリクエストを許可するかどうか
        |
        | false：
        |  - 今回は token / session / cookie を使っていない
        |  - Next.js 経由で API を叩いているため不要
        |
        | true にするのは以下の場合：
        |  - Sanctum を使った SPA 認証
        |  - Laravel のセッション Cookie を使う場合
     */
    'supports_credentials' => false,

];
