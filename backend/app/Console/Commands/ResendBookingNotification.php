<?php

namespace App\Console\Commands;

use App\Events\BookingCreated;
use App\Models\Booking;
use Illuminate\Console\Command;

class ResendBookingNotification extends Command
{
    protected $signature   = 'booking:resend {id? : Booking ID (defaults to latest)}';
    protected $description = 'Resend notifications for a booking';

    public function handle(): void
    {
        $id      = $this->argument('id');
        $booking = $id ? Booking::findOrFail($id) : Booking::latest()->first();

        $this->info("Resending notifications for booking #{$booking->booking_number}...");
        BookingCreated::dispatch($booking);
        $this->info('Done. Check your email.');
    }
}
