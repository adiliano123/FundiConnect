<?php

namespace App\Mail;

use App\Models\WithdrawalRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public WithdrawalRequest $withdrawal) {}

    public function envelope(): Envelope
    {
        $subject = $this->withdrawal->status === 'completed'
            ? "✅ Withdrawal Approved – {$this->withdrawal->reference}"
            : "❌ Withdrawal Rejected – {$this->withdrawal->reference}";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.withdrawal.status', with: [
            'withdrawal' => $this->withdrawal,
        ]);
    }
}
