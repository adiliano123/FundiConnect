<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\NotificationLog;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MailService
{
    public static function send(
        string $to,
        Mailable $mailable,
        string $event,
        string $channel,
        ?Booking $booking = null,
        ?int $userId = null
    ): void {
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

        try {
            Mail::to($to)->send($mailable);
            $log->update(['status' => 'sent']);
        } catch (Throwable $e) {
            $log->update(['status' => 'failed', 'error' => $e->getMessage()]);
        }
    }
}
