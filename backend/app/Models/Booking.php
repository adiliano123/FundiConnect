<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number', 'customer_id', 'technician_id', 'service_id', 'category_id',
        'description', 'address', 'city', 'scheduled_at', 'status',
        'rejection_reason', 'cancellation_reason', 'estimated_cost', 'final_cost',
        'accepted_at', 'started_at', 'completed_at', 'paid_at',
    ];

    protected $casts = [
        'scheduled_at'   => 'datetime',
        'accepted_at'    => 'datetime',
        'started_at'     => 'datetime',
        'completed_at'   => 'datetime',
        'paid_at'        => 'datetime',
        'estimated_cost' => 'float',
        'final_cost'     => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($booking) {
            $booking->booking_number = 'FC-' . strtoupper(uniqid());
        });
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function complaint()
    {
        return $this->hasOne(Complaint::class);
    }

    public function isPending(): bool          { return $this->status === 'pending'; }
    public function isAccepted(): bool         { return $this->status === 'accepted'; }
    public function isAwaitingPayment(): bool  { return $this->status === 'awaiting_payment'; }
    public function isPaid(): bool             { return $this->status === 'paid'; }
    public function isInProgress(): bool       { return $this->status === 'in_progress'; }
    public function isCompleted(): bool        { return $this->status === 'completed'; }
    public function isCancelled(): bool        { return $this->status === 'cancelled'; }
}
