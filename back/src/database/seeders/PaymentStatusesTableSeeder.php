<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $paymentStatus = [
            'ポイント適用済み',
            '支払い完了',
            'あと払い（ペイディ）待機中',
            '返金手続き中',
            '返金完了',
        ];

        foreach ($paymentStatus as $status) {
            DB::table('payment_statuses')->insert([
                'payment_status' => $status,
            ]);
        }
    }
}
