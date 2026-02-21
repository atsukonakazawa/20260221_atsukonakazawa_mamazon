<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            '本・コミック・雑誌',
            'DVD・ミュージック・ゲーム',
            '家電・カメラ・AV機器',
            'パソコン・オフィス用品',
            'ホーム＆キッチン・ペット・DIY',
            '食品・飲料・お酒',
            'ドラッグストア・ビューティー',
            'ベビー・おもちゃ・ホビー',
            '服・シューズ・バッグ・腕時計',
            'スポーツ＆アウトドア',
            '車＆バイク・産業・研究開発'
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'category_name' => $category,
            ]);
        }
    }
}
