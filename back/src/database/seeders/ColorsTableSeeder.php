<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $colors = [
            'ブラック系',
            'グレー系',
            'ブルー系',
            'ホワイト系',
            'ブラウン系',
            'グレージュ系',
            'レッド系',
            'ピンク系',
            'オレンジ系',
            'イエロー系',
            'アイボリー系',
            'グリーン系',
            'ライトグリーン系',
            'ライトブルー系',
            'ブルー系',
            'パープル系',
            'ベージュ系',
            'レインボー系',
            'ノーカラー系'
        ];

        foreach ($colors as $color) {
            DB::table('colors')->insert([
                'color_name' => $color,
            ]);
        }
    }
}
