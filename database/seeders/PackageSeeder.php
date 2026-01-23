<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Basic Therapy - 30 min',
                'duration_minutes' => 30,
                'price' => 1500.00,
            ],
            [
                'name' => 'Standard Therapy - 45 min',
                'duration_minutes' => 45,
                'price' => 2000.00,
            ],
            [
                'name' => 'Premium Therapy - 60 min',
                'duration_minutes' => 60,
                'price' => 2500.00,
            ],
            [
                'name' => 'VIP Therapy - 90 min',
                'duration_minutes' => 90,
                'price' => 3500.00,
            ],
            [
                'name' => 'Executive Therapy - 120 min',
                'duration_minutes' => 120,
                'price' => 4500.00,
            ],
            [
                'name' => 'Couples Special - 60 min',
                'duration_minutes' => 60,
                'price' => 4000.00,
            ],
            [
                'name' => 'Quick Refresh - 15 min',
                'duration_minutes' => 15,
                'price' => 800.00,
            ],
        ];
        
        foreach ($packages as $package) {
            Package::updateOrCreate(
                ['name' => $package['name']],
                $package
            );
        }
    }
}
