<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\BedAvailabilityService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Update bed allocation statuses every minute
Artisan::command('bookings:update-status', function () {
    $service = new BedAvailabilityService();
    $service->updateBedStatuses();
    $this->info('Bed allocation statuses updated successfully.');
})->purpose('Update bed allocation statuses: mark ended bookings as completed, start in-progress bookings, and auto-cancel unpaid bookings after 15 minutes');

// Schedule the command to run every minute
Schedule::command('bookings:update-status')->everyMinute();
