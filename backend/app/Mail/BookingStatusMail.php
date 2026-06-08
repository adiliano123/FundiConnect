<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    private string $emailSubject;

    public function __construct(public Booking $booking, public string $status)
    {
        $subjects = [
            'accepted'    => "Your Booking #{$booking->booking_number} Was Accepted ✓",
            'rejected'    => "Your Booking #{$booking->booking_number} Was Rejected",
            'in_progress' => "Work Has Started on Booking #{$booking->booking_number} 🔧",
            'completed'   => "Booking #{$booking->booking_number} Is Complete 🎉 — Leave a Review",
            'cancelled'   => "Booking #{$booking->booking_number} Was Cancelled",
        ];

        $this->emailSubject = $subjects[$status] ?? "Booking Update – #{$booking->booking_number}";
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->emailSubject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking.status_update', with: [
            'booking' => $this->booking,
            'status'  => $this->status,
        ]);
    }
}
