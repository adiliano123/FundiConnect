<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMail extends Command
{
    protected $signature   = 'mail:test {email}';
    protected $description = 'Send a test email to verify SMTP configuration';

    public function handle(): void
    {
        $email = $this->argument('email');
        $this->info("Sending test email to {$email}...");

        try {
            Mail::html(
                '<h2 style="color:#1D234F">FundiConnect SMTP Test</h2><p>If you see this, Gmail SMTP is working correctly!</p>',
                function ($message) use ($email) {
                    $message->to($email)->subject('FundiConnect — SMTP Test ✓');
                }
            );
            $this->info('✓ Email sent successfully!');
        } catch (\Throwable $e) {
            $this->error('✗ Failed: ' . $e->getMessage());
        }
    }
}
