<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentDatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shipmentDates = [
            '本日中',
            '明日まで',
            '２〜３日後',
            '４〜５日後',
            '６〜７日後',
            '１〜２週間後',
            '２週間後以降',
        ];

        foreach ($shipmentDates as $date) {
            DB::table('shipment_dates')->insert([
                'shipment_date' => $date . 'にお届け', // ← カラム名に合わせて変更
            ]);
        }
    }
}
