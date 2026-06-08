<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_id', 'wallet_id', 'reference', 'amount', 'currency',
        'method', 'account_number', 'account_name', 'bank_name',
        'status', 'processed_by', 'admin_notes', 'processed_at',
    ];

    protected $casts = [
        'amount'       => 'float',
        'processed_at' => 'datetime',
    ];

    public function technician()  { return $this->belongsTo(Technician::class); }
    public function wallet()      { return $this->belongsTo(Wallet::class); }
    public function processedBy() { return $this->belongsTo(User::class, 'processed_by'); }

    public function isPending():   bool { return $this->status === 'pending'; }
    public function isApproved():  bool { return $this->status === 'approved'; }
    public function isCompleted(): bool { return $this->status === 'completed'; }
    public function isRejected():  bool { return $this->status === 'rejected'; }
}
