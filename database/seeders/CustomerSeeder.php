<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'John Doe',
                'phone' => '+1234567890',
                'email' => 'john.doe@example.com',
            ],
            [
                'name' => 'Jane Smith',
                'phone' => '+1234567891',
                'email' => 'jane.smith@example.com',
            ],
            [
                'name' => 'Mike Johnson',
                'phone' => '+1234567892',
                'email' => 'mike.johnson@example.com',
            ],
            [
                'name' => 'Sarah Wilson',
                'phone' => '+1234567893',
                'email' => 'sarah.wilson@example.com',
            ],
            [
                'name' => 'David Brown',
                'phone' => '+1234567894',
                'email' => null,
            ],
            [
                'name' => 'Lisa Davis',
                'phone' => '+1234567895',
                'email' => 'lisa.davis@example.com',
            ],
            [
                'name' => 'Robert Miller',
                'phone' => '+1234567896',
                'email' => null,
            ],
            [
                'name' => 'Emily Taylor',
                'phone' => '+1234567897',
                'email' => 'emily.taylor@example.com',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::firstOrCreate(
                ['phone' => $customer['phone']], // Check by phone (unique field)
                $customer
            );
        }
    }
}