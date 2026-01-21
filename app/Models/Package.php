<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'duration_minutes',
        'price',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Get the bed allocations for the package.
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(BedAllocation::class);
    }
}
