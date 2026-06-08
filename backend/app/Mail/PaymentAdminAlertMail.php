<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentAdminAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Payment $payment) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "💰 New Payment – TZS " . number_format($this->payment->amount, 0) . " | FundiConnect");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.payment.admin_alert');
    }
}
