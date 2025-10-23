<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',     // 👈 thêm dòng này
        'movie_id',
        'showtime_id',
        'seats',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
