<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropApprovedByFromProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {

            // 外部キーが存在する場合だけ削除
            try {
                $table->dropForeign(['approved_by']);
            } catch (\Exception $e) {
                // 既に存在しない場合は何もしない
            }

            // カラムが存在する場合だけ削除
            if (Schema::hasColumn('products', 'approved_by')) {
                $table->dropColumn('approved_by');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('approved_by')
                ->nullable();
        });
    }
}
