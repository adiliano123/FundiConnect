<?php

namespace App\Providers;

use App\Events\BookingCreated;
use App\Events\BookingStatusUpdated;
use App\Events\PaymentProcessed;
use App\Listeners\HandlePaymentProcessed;
use App\Listeners\SendBookingCreatedNotifications;
use App\Listeners\SendBookingStatusNotifications;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        BookingCreated::class => [
            SendBookingCreatedNotifications::class,
        ],
        BookingStatusUpdated::class => [
            SendBookingStatusNotifications::class,
        ],
        PaymentProcessed::class => [
            HandlePaymentProcessed::class,
        ],
    ];

    public function boot(): void {}

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
