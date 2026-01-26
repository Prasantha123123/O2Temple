<?php

namespace App\Services;

use App\Models\Bed;
use App\Models\BedAllocation;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class BedAvailabilityService
{
    /**
     * Threshold in minutes before a booking starts to mark bed as "booked_soon"
     * and block new bookings. Until this threshold, beds remain available.
     */
    private const BOOKED_SOON_THRESHOLD = 15;

    /**
     * Get all beds with their current availability status.
     * 
     * Status Logic (15-minute pre-booking lock):
     * - 'occupied': PAID booking where current time is WITHIN start_time and end_time
     * - 'booked_soon': Booking starting within 15 minutes (locks the bed)
     * - 'available': No current bookings, or future bookings more than 15 min away
     * - 'maintenance': Bed is under maintenance
     * 
     * NOTE: Beds remain AVAILABLE until 15 minutes before a booking starts.
     * This allows other customers to use the bed until the lock window.
     */
    public function getAllBedsWithStatus(): Collection
    {
        $now = now();
        
        // Get PAID allocations CURRENTLY IN PROGRESS (now is between start and end)
        $currentOccupiedAllocations = BedAllocation::with(['customer', 'package'])
            ->where('start_time', '<=', $now)
            ->where('end_time', '>', $now)
            ->whereIn('status', ['confirmed', 'in_progress'])
            ->where('payment_status', 'paid')
            ->get()
            ->keyBy('bed_id');
        
        // Get allocations starting within 15 minutes (the lock window)
        // These beds become "booked_soon" and block new bookings
        $upcomingAllocations = BedAllocation::with(['customer', 'package'])
            ->where('start_time', '>', $now)
            ->where('start_time', '<=', $now->copy()->addMinutes(self::BOOKED_SOON_THRESHOLD))
            ->where('status', '!=', 'cancelled')
            ->get()
            ->keyBy('bed_id');
        
        return Bed::available()->orderByGrid()->get()->map(function ($bed) use ($currentOccupiedAllocations, $upcomingAllocations, $now) {
            $occupiedAllocation = $currentOccupiedAllocations->get($bed->id);
            $upcomingAllocation = $upcomingAllocations->get($bed->id);
            
            // Status priority: maintenance > occupied > booked_soon (within 15 min) > available
            $status = 'available';
            $allocation = null;
            
            if ($bed->status === 'maintenance') {
                $status = 'maintenance';
            } elseif ($occupiedAllocation) {
                // Currently occupied - paid and within time window
                $status = 'occupied';
                $allocation = $occupiedAllocation;
            } elseif ($upcomingAllocation) {
                // Booking starting within 15 minutes - lock the bed
                $status = 'booked_soon';
                $allocation = $upcomingAllocation;
            }
            // Note: Future bookings more than 15 min away keep bed as 'available'
            
            return [
                'id' => $bed->id,
                'bed_number' => $bed->bed_number,
                'display_name' => $bed->display_name ?? 'Table ' . $bed->bed_number,
                'grid_row' => $bed->grid_row,
                'grid_col' => $bed->grid_col,
                'bed_type' => $bed->bed_type,
                'status' => $status,
                'current_allocation' => $allocation,
            ];
        });
    }

    /**
     * Check if a specific bed is available for a given time range.
     */
    public function isBedAvailable(int $bedId, Carbon $startTime, Carbon $endTime, ?int $excludeAllocationId = null): bool
    {
        $bed = Bed::find($bedId);
        
        if (!$bed || $bed->status === 'maintenance') {
            return false;
        }

        return !BedAllocation::where('bed_id', $bedId)
            ->where('status', '!=', 'cancelled')
            ->when($excludeAllocationId, fn($q) => $q->where('id', '!=', $excludeAllocationId))
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime);
            })
            ->exists();
    }

    /**
     * Get available beds for a specific time range.
     */
    public function getAvailableBeds(Carbon $startTime, Carbon $endTime): Collection
    {
        $allBeds = Bed::available()->orderByGrid()->get();
        
        // Get all conflicting allocations
        $conflictingBedIds = BedAllocation::where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->pluck('bed_id')
            ->unique();

        return $allBeds->filter(fn($bed) => !$conflictingBedIds->contains($bed->id));
    }

    /**
     * Get bed availability for a specific date with all time slots.
     */
    public function getBedAvailabilityForDate(int $bedId, Carbon $date): array
    {
        $bed = Bed::find($bedId);
        
        if (!$bed) {
            return [];
        }

        $allocations = $bed->getAllocationsForDate($date);
        
        // Define business hours (8 AM to 10 PM)
        $businessStart = $date->copy()->setTime(8, 0);
        $businessEnd = $date->copy()->setTime(22, 0);

        $timeSlots = [];
        $currentTime = $businessStart->copy();

        while ($currentTime < $businessEnd) {
            $slotEnd = $currentTime->copy()->addMinutes(30);
            
            $isOccupied = $allocations->contains(function ($allocation) use ($currentTime, $slotEnd) {
                return $allocation->start_time < $slotEnd && $allocation->end_time > $currentTime;
            });

            $allocation = $isOccupied ? $allocations->first(function ($alloc) use ($currentTime) {
                return $alloc->start_time <= $currentTime && $alloc->end_time > $currentTime;
            }) : null;

            $timeSlots[] = [
                'start_time' => $currentTime->format('H:i'),
                'end_time' => $slotEnd->format('H:i'),
                'is_available' => !$isOccupied && $currentTime >= now(),
                'is_past' => $currentTime < now(),
                'allocation' => $allocation ? [
                    'id' => $allocation->id,
                    'booking_number' => $allocation->booking_number,
                    'customer_name' => $allocation->customer->name ?? 'Unknown',
                ] : null,
            ];

            $currentTime = $slotEnd;
        }

        return $timeSlots;
    }

    /**
     * Get all beds with availability for a specific time range.
     */
    public function getBedsWithAvailability(Carbon $date, ?string $startTime = null, ?string $endTime = null): Collection
    {
        $beds = Bed::available()->orderByGrid()->get();

        return $beds->map(function ($bed) use ($date, $startTime, $endTime) {
            $availability = [
                'id' => $bed->id,
                'bed_number' => $bed->bed_number,
                'display_name' => $bed->display_name ?? 'Table ' . $bed->bed_number,
                'grid_row' => $bed->grid_row,
                'grid_col' => $bed->grid_col,
                'bed_type' => $bed->bed_type,
                'current_status' => $bed->getAvailabilityStatus(),
                'is_available' => true,
                'conflicting_bookings' => [],
            ];

            if ($startTime && $endTime) {
                $start = Carbon::parse($date->format('Y-m-d') . ' ' . $startTime);
                $end = Carbon::parse($date->format('Y-m-d') . ' ' . $endTime);

                $conflicts = BedAllocation::where('bed_id', $bed->id)
                    ->where('status', '!=', 'cancelled')
                    ->where('start_time', '<', $end)
                    ->where('end_time', '>', $start)
                    ->with(['customer', 'package'])
                    ->get();

                $availability['is_available'] = $conflicts->isEmpty();
                $availability['conflicting_bookings'] = $conflicts->map(fn($booking) => [
                    'id' => $booking->id,
                    'booking_number' => $booking->booking_number,
                    'customer_name' => $booking->customer->name ?? 'Unknown',
                    'start_time' => $booking->start_time->format('H:i'),
                    'end_time' => $booking->end_time->format('H:i'),
                ]);
            }

            // Get all bookings for the day
            $dayBookings = $bed->getAllocationsForDate($date);
            $availability['day_bookings'] = $dayBookings->map(fn($booking) => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'customer_name' => $booking->customer->name ?? 'Unknown',
                'start_time' => $booking->start_time->format('H:i'),
                'end_time' => $booking->end_time->format('H:i'),
                'status' => $booking->status,
            ]);

            return $availability;
        });
    }

    /**
     * Automatically update bed statuses based on current time.
     * This should be called by a scheduler.
     */
    public function updateBedStatuses(): void
    {
        $now = now();

        // Find allocations that have ended but are still marked as active
        BedAllocation::where('status', 'in_progress')
            ->where('end_time', '<', $now)
            ->update(['status' => 'completed']);

        // Find allocations that should be in progress
        BedAllocation::where('status', 'confirmed')
            ->where('start_time', '<=', $now)
            ->where('end_time', '>', $now)
            ->update(['status' => 'in_progress']);

        // Cancel bookings that are 15 minutes past their start time and have no invoice/payment
        $overdueAllocations = BedAllocation::where('status', 'confirmed')
            ->where('start_time', '<', $now->copy()->subMinutes(15))
            ->whereDoesntHave('invoices', function ($query) {
                $query->whereIn('status', ['draft', 'pending', 'completed'])
                      ->where('payment_status', '!=', 'unpaid');
            })
            ->get();

        foreach ($overdueAllocations as $allocation) {
            $allocation->update([
                'status' => 'cancelled',
                'notes' => ($allocation->notes ? $allocation->notes . ' | ' : '') . 'Auto-cancelled: No payment received within 15 minutes.'
            ]);
        }
        
        // Update bed table status based on paid allocations
        $this->updateBedTableStatuses();
    }
    
    /**
     * Update the status column in the beds table based on allocations.
     * 
     * Bed status logic (15-minute pre-booking lock):
     * - 'occupied': PAID booking currently in progress (now between start and end)
     * - 'booked_soon': Booking starting within 15 minutes (locks the bed)
     * - 'available': No current bookings, or future bookings more than 15 min away
     */
    public function updateBedTableStatuses(): void
    {
        $now = now();
        
        // Get beds with PAID allocations CURRENTLY IN PROGRESS
        $currentOccupiedBedIds = BedAllocation::where('start_time', '<=', $now)
            ->where('end_time', '>', $now)
            ->whereIn('status', ['confirmed', 'in_progress'])
            ->where('payment_status', 'paid')
            ->pluck('bed_id')
            ->unique();
        
        // Get beds with bookings starting within 15 minutes (the lock window)
        $upcomingBedIds = BedAllocation::where('start_time', '>', $now)
            ->where('start_time', '<=', $now->copy()->addMinutes(self::BOOKED_SOON_THRESHOLD))
            ->where('status', '!=', 'cancelled')
            ->pluck('bed_id')
            ->unique();
        
        // Update beds to 'occupied' if they have current paid allocations
        if ($currentOccupiedBedIds->isNotEmpty()) {
            Bed::whereIn('id', $currentOccupiedBedIds)
                ->where('status', '!=', 'maintenance')
                ->update(['status' => 'occupied']);
        }
        
        // Beds for booked_soon: within 15-minute lock window (but not currently occupied)
        $bookedSoonBedIds = $upcomingBedIds->diff($currentOccupiedBedIds);
        
        if ($bookedSoonBedIds->isNotEmpty()) {
            Bed::whereIn('id', $bookedSoonBedIds)
                ->where('status', '!=', 'maintenance')
                ->update(['status' => 'booked_soon']);
        }
        
        // All other beds are available (including those with future bookings > 15 min away)
        $busyBedIds = $currentOccupiedBedIds->merge($upcomingBedIds)->unique();
        Bed::whereNotIn('id', $busyBedIds)
            ->where('status', '!=', 'maintenance')
            ->update(['status' => 'available']);
    }
}
