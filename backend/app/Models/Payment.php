<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'customer_id', 'technician_id', 'reference', 'amount',
        'platform_fee', 'technician_payout', 'commission_rate', 'currency',
        'status', 'payment_method', 'gateway', 'phone_number',
        'gateway_reference', 'transaction_id', 'paid_at', 'failure_reason', 'meta',
    ];

    protected $casts = [
        'amount'            => 'float',
        'platform_fee'      => 'float',
        'technician_payout' => 'float',
        'commission_rate'   => 'float',
        'meta'              => 'array',
        'paid_at'           => 'datetime',
    ];

    public function booking()    { return $this->belongsTo(Booking::class); }
    public function customer()   { return $this->belongsTo(User::class, 'customer_id'); }
    public function technician() { return $this->belongsTo(Technician::class); }
    public function walletTransactions() { return $this->hasMany(WalletTransaction::class); }

    public function isPending():   bool { return $this->status === 'pending'; }
    public function isCompleted(): bool { return $this->status === 'completed'; }
    public function isFailed():    bool { return $this->status === 'failed'; }
}
