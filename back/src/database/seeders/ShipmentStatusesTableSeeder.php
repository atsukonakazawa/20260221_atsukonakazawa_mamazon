<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shipmentStatus = [
            '出荷準備中',
            '配送中',
            'お届け済み',
            '返品リクエスト受付済み',
            '返品完了',
        ];

        foreach ($shipmentStatus as $status) {
            DB::table('shipment_statuses')->insert([
                'shipment_status' => $status,
            ]);
        }
    }
}
