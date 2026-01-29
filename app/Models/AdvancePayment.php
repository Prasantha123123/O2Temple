<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvancePayment extends Model
{
    protected $fillable = [
        'receipt_number',
        'allocation_id',
        'customer_id',
        'amount',
        'payment_method',
        'reference_number',
        'notes',
        'received_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Boot the model and add event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->receipt_number)) {
                $model->receipt_number = self::generateReceiptNumber();
            }
        });
    }

    /**
     * Generate a unique receipt number.
     */
    public static function generateReceiptNumber(): string
    {
        $prefix = 'ADV';
        $date = now()->format('ymd');
        $lastReceipt = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastReceipt ? (int) substr($lastReceipt->receipt_number, -4) + 1 : 1;
        
        return $prefix . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get the allocation that owns the advance payment.
     */
    public function allocation(): BelongsTo
    {
        return $this->belongsTo(BedAllocation::class, 'allocation_id');
    }

    /**
     * Get the customer that made the payment.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the user who received the payment.
     */
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * Get the payment method label.
     */
    public function getPaymentMethodLabelAttribute(): string
    {
        return match($this->payment_method) {
            'cash' => 'Cash',
            'card' => 'Card',
            'bank_transfer' => 'Bank Transfer',
            default => ucfirst($this->payment_method),
        };
    }
}
