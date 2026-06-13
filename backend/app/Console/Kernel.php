<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Restart queue worker every minute to ensure it's always running
        $schedule->command('queue:work --tries=3 --timeout=60 --stop-when-empty')
                 ->everyMinute()
                 ->withoutOverlapping()
                 ->runInBackground();

        // Clean up old failed jobs weekly
        $schedule->command('queue:flush')->weekly();

        // Prune old notification logs older than 90 days
        $schedule->command('model:prune')->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
