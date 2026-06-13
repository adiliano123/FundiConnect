<?php

namespace App\Mail;

use App\Models\Technician;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TechnicianVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Technician $technician) {}

    public function envelope(): Envelope
    {
        $subject = $this->technician->verification_status === 'verified'
            ? '🎉 Your FundiConnect Account Has Been Verified!'
            : 'FundiConnect Verification Update';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.technician.verification');
    }
}
