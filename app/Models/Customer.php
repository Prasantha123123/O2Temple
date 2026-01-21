<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
    ];

    /**
     * Get the bed allocations for the customer.
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(BedAllocation::class);
    }
}
