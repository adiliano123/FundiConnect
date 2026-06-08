<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BookingStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public string $event
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $messages = [
            'new_booking'  => "New booking request #{$this->booking->booking_number}",
            'confirmed'    => "Your booking #{$this->booking->booking_number} has been submitted",
            'accepted'     => "Your booking #{$this->booking->booking_number} was accepted",
            'rejected'     => "Your booking #{$this->booking->booking_number} was rejected",
            'in_progress'  => "Work has started on booking #{$this->booking->booking_number}",
            'completed'    => "Booking #{$this->booking->booking_number} is complete — please leave a review",
            'cancelled'    => "Booking #{$this->booking->booking_number} was cancelled",
        ];

        return [
            'booking_id'     => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'event'          => $this->event,
            'message'        => $messages[$this->event] ?? "Booking update #{$this->booking->booking_number}",
            'status'         => $this->booking->status,
        ];
    }
}
