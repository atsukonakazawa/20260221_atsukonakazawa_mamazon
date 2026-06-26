<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CategoriesTableSeeder::class,
            ColorsTableSeeder::class,
            ShipmentDatesTableSeeder::class,
            SizesTableSeeder::class,
            SellersTableSeeder::class,
            ShipmentStatusesTableSeeder::class,
            PaymentWaysTableSeeder::class,
            PaymentStatusesTableSeeder::class,
        ]);
    }
}
