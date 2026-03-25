<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // ▼ 外部キー
            //この外部キーの書き方によりunsignedBigInteger型になる
            //unsignedBigIntegerは外部キーでよく使われる
            //マイナスの値は入らない、しかし大きな値まで保存できる型
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('color_id')->nullable();
            $table->foreign('color_id')->references('id')->on('colors')->nullOnDelete();
            $table->foreignId('shipment_date_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('size_id')->nullable();
            $table->foreign('size_id')->references('id')->on('sizes')->nullOnDelete();
            $table->foreignId('seller_id')->constrained()->cascadeOnDelete();

            // ▼ 商品情報
            $table->string('product_name');
            $table->integer('product_price');
            $table->text('product_description')->nullable();
            $table->string('product_image')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
