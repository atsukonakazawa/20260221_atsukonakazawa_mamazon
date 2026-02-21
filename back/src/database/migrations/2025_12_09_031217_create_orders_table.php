<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_way_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_status_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shipment_status_id')->constrained()->cascadeOnDelete();

            $table->string('shipping_postcode');
            $table->string('shipping_address');
            $table->string('shipping_name');
            $table->string('sender');
            $table->integer('total_price');

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
        Schema::dropIfExists('orders');
    }
}
