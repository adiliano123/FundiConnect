<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public string $newStatus,
        public string $actorRole  // 'technician' | 'customer' | 'admin'
    ) {}
}
