<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NumbersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1〜10までの数字を登録
        for ($i = 1; $i <= 10; $i++) {
            DB::table('numbers')->insert([
                'quantity' => $i,
            ]);
        }
    }
}
