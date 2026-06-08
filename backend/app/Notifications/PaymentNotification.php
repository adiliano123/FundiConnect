<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

/**
 * In-app (database) notification for payment events.
 * Sent to customer, technician, and admin.
 */
class PaymentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Payment $payment,
        public string  $role  // 'customer' | 'technician' | 'admin'
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $booking = $this->payment->booking;
        $amount  = number_format($this->payment->amount, 0);

        $messages = [
            'customer'   => "Payment of TZS {$amount} confirmed for booking #{$booking->booking_number}. Receipt sent to your email.",
            'technician' => "You received a payment of TZS " . number_format($this->payment->technician_payout, 0) . " for booking #{$booking->booking_number}.",
            'admin'      => "New payment of TZS {$amount} received. Booking #{$booking->booking_number}. Platform fee: TZS " . number_format($this->payment->platform_fee, 0) . ".",
        ];

        return [
            'payment_id'     => $this->payment->id,
            'booking_id'     => $booking->id,
            'booking_number' => $booking->booking_number,
            'amount'         => $this->payment->amount,
            'event'          => 'payment_completed',
            'role'           => $this->role,
            'message'        => $messages[$this->role] ?? $messages['admin'],
        ];
    }
}
