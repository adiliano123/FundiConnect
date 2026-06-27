<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User   $user,
        public string $resetUrl
    ) {}

    public function headers(): Headers
    {
        return new Headers(
            messageId: 'password-reset-' . $this->user->id . '-' . time() . '@fundiconnect',
            references: [],
            text: [
                'X-Mailer'       => 'FundiConnect Mailer',
                'X-Priority'     => '1',
                'Auto-Submitted' => 'auto-generated',
            ],
        );
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your FundiConnect Password');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.auth.password_reset');
    }
}
