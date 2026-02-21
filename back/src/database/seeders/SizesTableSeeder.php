<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SizesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sizes = [
            '60~70',
            '80~90',
            '100',
            '110',
            '120',
            '130',
            '140',
            '150',
            '160',
            'レディースXS',
            'レディースSS',
            'レディースS',
            'レディースM',
            'レディースL',
            'レディースXL',
            'レディース3L',
            'レディースFree',
            'メンズXS',
            'メンズSS',
            'メンズS',
            'メンズM',
            'メンズL',
            'メンズXL',
            'メンズ3L',
            'メンズFree',
            '~13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30~',

        ];

        foreach ($sizes as $size) {
            DB::table('sizes')->insert([
                'size_name' => $size,
            ]);
        }
    }
}
