<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddApprovalColumnsToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // 承認状態
            $table->string('approve_status')
                ->default('pending')
                ->after('is_active');

            // 承認日時
            $table->timestamp('approved_at')
                ->nullable()
                ->after('approve_status');

            // 承認した管理者
            $table->string('approved_by')
                ->nullable()
                ->after('approved_at');

            // 却下理由
            $table->text('rejection_reason')
                ->nullable()
                ->after('approved_by');
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
            $table->dropColumn([
                'approve_status',
                'approved_at',
                'approved_by',
                'rejection_reason'
            ]);
        });
    }
}
