<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Bed;

class BedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $beds = [];
        $row = 1;
        $col = 1;
        
        for ($i = 1; $i <= 25; $i++) {
            $beds[] = [
                'bed_number' => (string) $i,
                'display_name' => 'Table ' . $i,
                'grid_row' => $row,
                'grid_col' => $col,
                'bed_type' => $i <= 5 ? 'vip' : 'standard',
                'hourly_rate' => $i <= 5 ? 2000.00 : 1500.00,
                'status' => 'available',
                'description' => $i <= 5 ? 'VIP Table with premium amenities' : 'Standard table',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            $col++;
            if ($col > 5) {
                $col = 1;
                $row++;
            }
        }
        
        foreach ($beds as $bed) {
            Bed::updateOrCreate(
                ['bed_number' => $bed['bed_number']],
                $bed
            );
        }
    }
}
