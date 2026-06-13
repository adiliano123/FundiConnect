<?php

namespace App\Mail;

use App\Models\WithdrawalRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalRequestedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public WithdrawalRequest $withdrawal, public string $recipient = 'technician') {}

    public function envelope(): Envelope
    {
        $subject = $this->recipient === 'admin'
            ? "💸 Withdrawal Request #{$this->withdrawal->reference} | FundiConnect Admin"
            : "Withdrawal Request Submitted – {$this->withdrawal->reference}";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.withdrawal.requested', with: [
            'withdrawal' => $this->withdrawal,
            'recipient'  => $this->recipient,
        ]);
    }
}
