<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'color_id',
        'shipment_date_id',
        'size_id',
        'seller_id',
        'product_name',
        'product_price',
        'product_description',
        'product_image',
    ];

    // ▼ リレーション
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function shipmentDate()
    {
        return $this->belongsTo(ShipmentDate::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
