<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function headers(): Headers
    {
        return new Headers(
            messageId: 'welcome-' . $this->user->id . '-' . time() . '@fundiconnect',
            references: [],
            text: [
                'X-Mailer'         => 'FundiConnect Mailer',
                'X-Priority'       => '3',
                'Precedence'       => 'bulk',
                'Auto-Submitted'   => 'auto-generated',
            ],
        );
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Welcome to FundiConnect');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.auth.welcome');
    }
}
