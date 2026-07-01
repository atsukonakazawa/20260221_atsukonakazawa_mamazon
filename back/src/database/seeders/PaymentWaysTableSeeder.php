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
            'クレジット',
            'コンビニ払い',
        ];

        foreach ($paymentWays as $way) {
            DB::table('payment_ways')->insert([
                'payment_way' => $way,
            ]);
        }
    }
}
