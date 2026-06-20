<?php

namespace App\Listeners;

use App\Events\BookingStatusUpdated;
use App\Mail\BookingStatusMail;
use App\Models\Booking;
use App\Notifications\BookingStatusNotification;
use App\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendBookingStatusNotifications implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 30;

    public function handle(BookingStatusUpdated $event): void
    {
        $booking = $event->booking->load([
            'customer',
            'technician.user',
            'category'
        ]);

        $status = $event->newStatus;

        match ($event->actorRole) {

            'technician' => $this->notifyCustomer($booking, $status),

            'customer' => $this->notifyTechnician($booking, $status),

            'admin' => (function () use ($booking, $status) {
                $this->notifyCustomer($booking, $status);
                $this->notifyTechnician($booking, $status);
            })(),

            default => null,
        };
    }

    private function notifyCustomer(Booking $booking, string $status): void
    {
        MailService::send(
            $booking->customer->email,
            new BookingStatusMail($booking, $status, 'customer'),
            $status,
            'customer',
            $booking,
            $booking->customer->id
        );

        $booking->customer->notify(
            new BookingStatusNotification($booking, $status)
        );
    }

    private function notifyTechnician(Booking $booking, string $status): void
    {
        MailService::send(
            $booking->technician->user->email,
            new BookingStatusMail($booking, $status, 'technician'),
            $status,
            'technician',
            $booking,
            $booking->technician->user->id
        );

        $booking->technician->user->notify(
            new BookingStatusNotification($booking, $status)
        );
    }

    public function failed(
        BookingStatusUpdated $event,
        \Throwable $exception
    ): void {
        Log::error('BookingStatusUpdated listener failed', [
            'booking_id' => $event->booking->id,
            'status' => $event->newStatus,
            'error' => $exception->getMessage(),
        ]);
    }
}
