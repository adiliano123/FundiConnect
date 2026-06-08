<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_id', 'balance', 'pending_balance',
        'total_earned', 'total_withdrawn', 'currency',
    ];

    protected $casts = [
        'balance'          => 'float',
        'pending_balance'  => 'float',
        'total_earned'     => 'float',
        'total_withdrawn'  => 'float',
    ];

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function withdrawalRequests()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }
}
