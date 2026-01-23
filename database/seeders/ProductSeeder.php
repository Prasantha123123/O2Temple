<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Add-on Services
            [
                'name' => 'Aromatherapy Add-on',
                'sku' => 'SRV001',
                'category' => 'Services',
                'price' => 500.00,
                'is_active' => true,
            ],
            [
                'name' => 'Hot Stone Add-on',
                'sku' => 'SRV002',
                'category' => 'Services',
                'price' => 800.00,
                'is_active' => true,
            ],
            [
                'name' => 'Extended Time - 15 min',
                'sku' => 'SRV003',
                'category' => 'Services',
                'price' => 600.00,
                'is_active' => true,
            ],
            
            // Retail Products
            [
                'name' => 'Essential Oil - Lavender',
                'sku' => 'RTL001',
                'category' => 'Retail',
                'price' => 1200.00,
                'is_active' => true,
            ],
            [
                'name' => 'Essential Oil - Eucalyptus',
                'sku' => 'RTL002',
                'category' => 'Retail',
                'price' => 1000.00,
                'is_active' => true,
            ],
            [
                'name' => 'Massage Oil - 100ml',
                'sku' => 'RTL003',
                'category' => 'Retail',
                'price' => 800.00,
                'is_active' => true,
            ],
        ];
        
        foreach ($products as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );
        }
    }
}
