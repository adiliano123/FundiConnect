<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Mail\BookingConfirmedMail;
use App\Mail\NewBookingAdminAlertMail;
use App\Mail\NewBookingRequestMail;
use App\Models\User;
use App\Notifications\BookingStatusNotification;
use App\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendBookingCreatedNotifications implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 30;

    public function handle(BookingCreated $event): void
    {
        $booking = $event->booking->load([
            'customer',
            'technician.user',
            'category'
        ]);

        // 1. Confirmation email → customer
        MailService::send(
            $booking->customer->email,
            new BookingConfirmedMail($booking),
            'new_booking',
            'customer',
            $booking,
            $booking->customer->id
        );

        sleep(1);

        // 2. New request email → technician
        MailService::send(
            $booking->technician->user->email,
            new NewBookingRequestMail($booking),
            'new_booking',
            'technician',
            $booking,
            $booking->technician->user->id
        );

        sleep(1);

        // 3. Alert → all admins
        User::where('role', 'admin')->each(function ($admin) use ($booking) {
            MailService::send(
                $admin->email,
                new NewBookingAdminAlertMail($booking),
                'new_booking',
                'admin',
                $booking,
                $admin->id
            );

            sleep(1);
        });

        // 4. In-app notifications
        $booking->technician->user->notify(
            new BookingStatusNotification($booking, 'new_booking')
        );

        $booking->customer->notify(
            new BookingStatusNotification($booking, 'confirmed')
        );
    }

    public function failed(
        BookingCreated $event,
        \Throwable $exception
    ): void {
        Log::error('BookingCreated listener failed', [
            'booking_id' => $event->booking->id,
            'error'      => $exception->getMessage(),
            'file'       => $exception->getFile(),
            'line'       => $exception->getLine(),
        ]);
    }
}
