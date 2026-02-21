<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentWaysTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $paymentWays = [
            'Amazonポイント',
            'クレジット',
            'PayPay',
            'オリコ分割払い',
            'あと払い（ペイディ）',
            '携帯電話会社請求払い',
            'メルペイ',
        ];

        foreach ($paymentWays as $way) {
            DB::table('payment_ways')->insert([
                'payment_way' => $way,
            ]);
        }
    }
}
