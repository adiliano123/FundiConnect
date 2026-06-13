<?php

namespace App\Listeners;

use App\Events\PaymentProcessed;
use App\Mail\PaymentAdminAlertMail;
use App\Mail\PaymentReceiptMail;
use App\Mail\PaymentTechnicianMail;
use App\Models\User;
use App\Notifications\PaymentNotification;
use App\Services\MailService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Handles all post-payment notifications:
 * - Customer: receipt email + in-app notification
 * - Technician: earnings email + in-app notification
 * - Admin: alert email + in-app notification
 */
class HandlePaymentProcessed implements ShouldQueue
{
    public int $tries  = 3;
    public int $backoff = 30;

    public function handle(PaymentProcessed $event): void
    {
        $payment = $event->payment->load([
            'booking.category',
            'booking.technician.user',
            'customer',
            'technician.user',
        ]);

        // Customer receipt
        MailService::send(
            $payment->customer->email,
            new PaymentReceiptMail($payment),
            'payment_completed', 'customer',
            $payment->booking, $payment->customer_id
        );
        $payment->customer->notify(new PaymentNotification($payment, 'customer'));

        sleep(1);

        // Technician earnings alert
        MailService::send(
            $payment->technician->user->email,
            new PaymentTechnicianMail($payment),
            'payment_completed', 'technician',
            $payment->booking, $payment->technician->user->id
        );
        $payment->technician->user->notify(new PaymentNotification($payment, 'technician'));

        sleep(1);

        // Admin alert
        User::where('role', 'admin')->each(function (User $admin) use ($payment) {
            MailService::send(
                $admin->email,
                new PaymentAdminAlertMail($payment),
                'payment_completed', 'admin',
                $payment->booking, $admin->id
            );
            $admin->notify(new PaymentNotification($payment, 'admin'));
            sleep(1);
        });
    }

    public function failed(PaymentProcessed $event, \Throwable $e): void
    {
        Log::error('HandlePaymentProcessed failed', [
            'payment_id' => $event->payment->id,
            'error'      => $e->getMessage(),
        ]);
    }
}
