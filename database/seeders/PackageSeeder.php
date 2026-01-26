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
                'name' => 'Premium Therapy - 60 min',
                'duration_minutes' => 60,
                'price' => 2500.00,
            ]
        ];
        
        foreach ($packages as $package) {
            Package::updateOrCreate(
                ['name' => $package['name']],
                $package
            );
        }
    }
}
