<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class BedAllocation extends Model
{
    protected $fillable = [
        'customer_id',
        'bed_id',
        'package_id',
        'start_time',
        'end_time',
        'status',
        'payment_status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'status' => 'string',
        'payment_status' => 'string',
    ];

    /**
     * Get the customer that owns the allocation.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the bed that owns the allocation.
     */
    public function bed(): BelongsTo
    {
        return $this->belongsTo(Bed::class);
    }

    /**
     * Get the package that owns the allocation.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Get the payment for the allocation.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class, 'allocation_id');
    }

    /**
     * Calculate end time based on start time and package duration
     */
    public function calculateEndTime(): Carbon
    {
        return $this->start_time->addMinutes($this->package->duration_minutes);
    }
}
