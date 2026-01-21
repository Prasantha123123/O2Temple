<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bed extends Model
{
    protected $fillable = [
        'bed_number',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the bed allocations for the bed.
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(BedAllocation::class);
    }

    /**
     * Check if bed is available
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }
}
