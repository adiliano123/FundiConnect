<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\NotificationLog;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MailService
{
    public static function send(
        ?string $to,
        Mailable $mailable,
        string $event,
        string $channel,
        ?Booking $booking = null,
        ?int $userId = null
    ): void {
        // Guard: skip if recipient email is missing
        if (empty($to)) {
            Log::warning('MailService: skipped send — empty recipient', [
                'event'   => $event,
                'channel' => $channel,
            ]);
            return;
        }

        $log = null;

        try {
            $log = NotificationLog::create([
                'booking_id'      => $booking?->id,
                'user_id'         => $userId,
                'type'            => 'email',
                'channel'         => $channel,
                'event'           => $event,
                'recipient_email' => $to,
                'subject'         => $mailable->envelope()->subject ?? '',
                'status'          => 'queued',
            ]);
        } catch (Throwable $e) {
            // Don't let log failure stop the email
            Log::warning('MailService: could not create notification log', [
                'error' => $e->getMessage(),
            ]);
        }

        try {
            Mail::to($to)->send($mailable);

            $log?->update(['status' => 'sent']);

            Log::info("MailService: sent [{$event}] to {$to}");

        } catch (Throwable $e) {
            $log?->update(['status' => 'failed', 'error' => $e->getMessage()]);

            Log::error('MailService: failed to send email', [
                'to'      => $to,
                'event'   => $event,
                'channel' => $channel,
                'error'   => $e->getMessage(),
            ]);
        }
    }
}
