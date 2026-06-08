<?php

namespace App\Events;

use App\Models\Payment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired after a payment is confirmed as completed.
 * Listeners handle emails, in-app notifications, and wallet crediting.
 */
class PaymentProcessed
{
    use Dispatchable, SerializesModels;

    public function __construct(public Payment $payment) {}
}
