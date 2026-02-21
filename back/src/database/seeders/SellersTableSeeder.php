<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seller;

class SellersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sellers = [
            [
                'seller_name' => 'ハトムギ商事株式会社',
                'postcode'    => '100-0001',
                'address'     => '東京都千代田区千代田1-1',
                'tel'         => '03-1234-5678',
            ],
            [
                'seller_name' => 'マカロン販売合同会社',
                'postcode'    => '150-0001',
                'address'     => '東京都渋谷区神宮前1-1-1',
                'tel'         => '03-2345-6789',
            ],
            [
                'seller_name' => 'ホットココア株式会社',
                'postcode'    => '530-0001',
                'address'     => '大阪府大阪市北区梅田1-1-1',
                'tel'         => '06-3456-7890',
            ],
        ];

        foreach ($sellers as $seller) {
            Seller::create($seller);
        }
    }
}
