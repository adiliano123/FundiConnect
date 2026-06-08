<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id', 'technician_id', 'payment_id', 'booking_id',
        'type', 'amount', 'balance_before', 'balance_after',
        'description', 'reference', 'status',
    ];

    protected $casts = [
        'amount'         => 'float',
        'balance_before' => 'float',
        'balance_after'  => 'float',
    ];

    public function wallet()    { return $this->belongsTo(Wallet::class); }
    public function technician(){ return $this->belongsTo(Technician::class); }
    public function payment()   { return $this->belongsTo(Payment::class); }
    public function booking()   { return $this->belongsTo(Booking::class); }
}
