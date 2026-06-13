<?php

namespace App\Mail;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ComplaintReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Complaint $complaint, public string $recipient = 'complainant') {}

    public function envelope(): Envelope
    {
        $subject = $this->recipient === 'admin'
            ? "🚨 New Complaint #{$this->complaint->id} | FundiConnect Admin"
            : "Complaint Received – We're On It";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.complaint.received', with: [
            'complaint' => $this->complaint,
            'recipient' => $this->recipient,
        ]);
    }
}
