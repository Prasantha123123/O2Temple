<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'allocation_id',
        'base_amount',
        'discount_value',
        'final_amount',
        'payment_method',
        'payment_date',
        'status',
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'status' => 'string',
        'payment_method' => 'string',
    ];

    /**
     * Get the bed allocation that owns the payment.
     */
    public function allocation(): BelongsTo
    {
        return $this->belongsTo(BedAllocation::class, 'allocation_id');
    }
}
