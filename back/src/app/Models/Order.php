<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_way_id',
        'payment_status_id',
        'shipment_status_id',
        'shipping_postcode',
        'shipping_address',
        'shipping_name',
        'sender',
        'total_price',
        'payment_number',
        'confirmation_number',
        'payment_limit',
    ];

    // リレーション
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function paymentWay()
    {
        return $this->belongsTo(PaymentWay::class);
    }
    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class);
    }
    public function shipmentStatus()
    {
        return $this->belongsTo(ShipmentStatus::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
