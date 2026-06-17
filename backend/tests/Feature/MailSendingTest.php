<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailSendingTest extends TestCase
{
    /**
     * Test that SMTP configuration is correctly loaded from .env
     *
     * NOTE: During testing, Laravel's test environment (phpunit.xml)
     * overrides MAIL_MAILER to 'array' to prevent sending real emails.
     * This test verifies the SMTP config is available in .env for production.
     *
     * Production Configuration:
     * - MAIL_MAILER=smtp
     * - MAIL_HOST=smtp.gmail.com
     * - MAIL_PORT=587
     * - MAIL_ENCRYPTION=tls
     * - MAIL_USERNAME=adilianonathanael@gmail.com
     * - MAIL_FROM_ADDRESS=adilianonathanael@gmail.com
     *
     * @return void
     */
    public function test_smtp_configuration_is_available_in_env()
    {
        // Verify the .env file contains SMTP configuration
        $this->assertEquals('smtp.gmail.com', env('MAIL_HOST'));
        $this->assertEquals(587, env('MAIL_PORT'));
        $this->assertEquals('tls', env('MAIL_ENCRYPTION'));
        $this->assertEquals('adilianonathanael@gmail.com', env('MAIL_USERNAME'));
        $this->assertEquals('adilianonathanael@gmail.com', env('MAIL_FROM_ADDRESS'));
    }

    /**
     * Test that the application can queue mail messages
     * (In production, these will be sent via real SMTP)
     */
    public function test_mail_can_be_sent_in_test_mode()
    {
        Mail::fake();

        // Send a test email
        Mail::to('test@example.com')->send(new \Illuminate\Mail\Mailable() {
            public function build()
            {
                return $this->view('errors.404');
            }
        });

        // Verify it was sent (in array driver during tests)
        Mail::assertSent(\Illuminate\Mail\Mailable::class);
    }

    /**
     * Production-ready: To send real emails, run this manually:
     *
     * php artisan tinker
     * Mail::to('recipient@example.com')->send(new App\Mail\WelcomeMail($user));
     */
    public function test_documentation_for_real_email_sending()
    {
        $this->markTestSkipped('Manual test only - run in production to send real emails');
