<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Setting;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create initial services
        $services = [
            [
                'name' => 'Oil Change',
                'description' => 'Complete oil change service including filter replacement and multi-point inspection.',
                'price' => 49.99,
                'duration_minutes' => 45,
                'sort_order' => 1
            ],
            [
                'name' => 'Brake Service',
                'description' => 'Comprehensive brake inspection and repair including pad replacement and rotor resurfacing.',
                'price' => 199.99,
                'duration_minutes' => 120,
                'sort_order' => 2
            ],
            [
                'name' => 'Tire Rotation',
                'description' => 'Tire rotation service to ensure even wear and extend tire life.',
                'price' => 29.99,
                'duration_minutes' => 30,
                'sort_order' => 3
            ],
            [
                'name' => 'Engine Tune-up',
                'description' => 'Complete engine tune-up including spark plugs, filters, and performance optimization.',
                'price' => 299.99,
                'duration_minutes' => 180,
                'sort_order' => 4
            ],
            [
                'name' => 'AC Service',
                'description' => 'Air conditioning system inspection, recharge, and repair services.',
                'price' => 149.99,
                'duration_minutes' => 90,
                'sort_order' => 5
            ]
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name' => $service['name']],
                $service
            );
        }

        // Create initial settings
        $settings = [
            [
                'key' => 'company_name',
                'value' => 'Premium Auto Care',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Company Name',
                'description' => 'The name of your auto repair business'
            ],
            [
                'key' => 'company_description',
                'value' => 'Your trusted partner for all automotive repair and maintenance needs. We provide professional, reliable service with a commitment to quality and customer satisfaction.',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Company Description',
                'description' => 'Brief description of your business'
            ],
            [
                'key' => 'business_hours',
                'value' => 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Business Hours',
                'description' => 'Your business operating hours'
            ],
            [
                'key' => 'phone',
                'value' => '(555) 123-4567',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Phone Number',
                'description' => 'Primary contact phone number'
            ],
            [
                'key' => 'email',
                'value' => 'info@premiumautocare.com',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Email Address',
                'description' => 'Primary contact email address'
            ],
            [
                'key' => 'address',
                'value' => '123 Main Street, Anytown, ST 12345',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Address',
                'description' => 'Business physical address'
            ],
            [
                'key' => 'google_maps_embed',
                'value' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Google Maps Embed',
                'description' => 'Google Maps iframe embed code'
            ],
            [
                'key' => 'booking_start_time',
                'value' => '08:00',
                'type' => 'text',
                'group' => 'booking',
                'label' => 'Booking Start Time',
                'description' => 'Earliest time for bookings (24-hour format)'
            ],
            [
                'key' => 'booking_end_time',
                'value' => '17:00',
                'type' => 'text',
                'group' => 'booking',
                'label' => 'Booking End Time',
                'description' => 'Latest time for bookings (24-hour format)'
            ],
            [
                'key' => 'booking_interval',
                'value' => '30',
                'type' => 'text',
                'group' => 'booking',
                'label' => 'Booking Interval (minutes)',
                'description' => 'Time interval between available booking slots'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
