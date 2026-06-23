<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ────────────────────────────────────────────────────────
        User::create([
            'name'        => 'Admin User',
            'email'       => 'ekxaverysindobewe@gmail.com',
            'password'    => Hash::make('password'),
            'role'        => 'admin',
            'phone'       => '+255745290677',
            'city'        => 'Dar es Salaam',
            'country'     => 'Tanzania',
            'is_active'   => true,
            'is_verified' => true,
        ]);

        // ── Categories ───────────────────────────────────────────────────
        $categories = [
            ['name' => 'Electrical',       'icon' => 'zap',          'description' => 'Wiring, installations & electrical repairs'],
            ['name' => 'Plumbing',          'icon' => 'droplets',     'description' => 'Pipes, drains & water systems'],
            ['name' => 'Carpentry',         'icon' => 'hammer',       'description' => 'Furniture, doors & custom woodwork'],
            ['name' => 'Painting',          'icon' => 'paintbrush',   'description' => 'Interior & exterior painting services'],
            ['name' => 'AC Repair',         'icon' => 'wind',         'description' => 'AC installation, service & maintenance'],
            ['name' => 'Mechanics',         'icon' => 'wrench',       'description' => 'Vehicle repair & routine maintenance'],
            ['name' => 'Computer Repair',   'icon' => 'monitor',      'description' => 'PC, laptop & IT support services'],
            ['name' => 'CCTV Installation', 'icon' => 'camera',       'description' => 'Security cameras & surveillance systems'],
        ];

        $categoryIds = [];
        foreach ($categories as $i => $cat) {
            $created = Category::create(array_merge($cat, [
                'slug'       => Str::slug($cat['name']),
                'is_active'  => true,
                'sort_order' => $i + 1,
            ]));
            $categoryIds[$cat['name']] = $created->id;
        }

        // ── Sample Customer ──────────────────────────────────────────────
        User::create([
            'name'        => 'Amina Mbeki',
            'email'       => 'customer@fundiconnect.co.tz',
            'password'    => Hash::make('password'),
            'role'        => 'customer',
            'phone'       => '+255712345678',
            'city'        => 'Dar es Salaam',
            'country'     => 'Tanzania',
            'is_active'   => true,
            'is_verified' => true,
        ]);

        // ── Technicians ──────────────────────────────────────────────────
        $technicians = [
            [
                'user' => [
                    'name'    => 'Joseph Mwenda',
                    'email'   => 'technician@fundiconnect.co.tz',
                    'phone'   => '+255754001001',
                    'city'    => 'Dar es Salaam',
                ],
                'profile' => [
                    'category'         => 'Electrical',
                    'bio'              => 'Certified electrician with 8 years of residential & commercial experience.',
                    'experience_years' => 8,
                    'hourly_rate'      => 15000,
                    'service_area'     => 'Dar es Salaam, Kinondoni, Ilala',
                    'rating'           => 4.8,
                    'total_reviews'    => 42,
                    'total_jobs'       => 65,
                ],
            ],
            [
                'user' => [
                    'name'    => 'David Msigwa',
                    'email'   => 'david.msigwa@fundiconnect.co.tz',
                    'phone'   => '+255754002002',
                    'city'    => 'Arusha',
                ],
                'profile' => [
                    'category'         => 'Plumbing',
                    'bio'              => 'Experienced plumber specializing in emergency repairs and full installations.',
                    'experience_years' => 6,
                    'hourly_rate'      => 12000,
                    'service_area'     => 'Arusha, Moshi',
                    'rating'           => 4.6,
                    'total_reviews'    => 28,
                    'total_jobs'       => 44,
                ],
            ],
            [
                'user' => [
                    'name'    => 'Grace Mwanza',
                    'email'   => 'grace.mwanza@fundiconnect.co.tz',
                    'phone'   => '+255754003003',
                    'city'    => 'Mwanza',
                ],
                'profile' => [
                    'category'         => 'Carpentry',
                    'bio'              => 'Custom furniture maker and expert in door & window installations.',
                    'experience_years' => 10,
                    'hourly_rate'      => 18000,
                    'service_area'     => 'Mwanza, Musoma',
                    'rating'           => 4.9,
                    'total_reviews'    => 55,
                    'total_jobs'       => 80,
                ],
            ],
            [
                'user' => [
                    'name'    => 'John Kimaro',
                    'email'   => 'john.kimaro@fundiconnect.co.tz',
                    'phone'   => '+255754004004',
                    'city'    => 'Dodoma',
                ],
                'profile' => [
                    'category'         => 'AC Repair',
                    'bio'              => 'Certified AC technician handling all major brands — installation and servicing.',
                    'experience_years' => 5,
                    'hourly_rate'      => 20000,
                    'service_area'     => 'Dodoma, Dar es Salaam',
                    'rating'           => 4.7,
                    'total_reviews'    => 33,
                    'total_jobs'       => 50,
                ],
            ],
            [
                'user' => [
                    'name'    => 'Farida Hassan',
                    'email'   => 'farida.hassan@fundiconnect.co.tz',
                    'phone'   => '+255754005005',
                    'city'    => 'Zanzibar',
                ],
                'profile' => [
                    'category'         => 'Painting',
                    'bio'              => 'Professional painter with expertise in both interior and exterior finishes.',
                    'experience_years' => 7,
                    'hourly_rate'      => 10000,
                    'service_area'     => 'Zanzibar, Dar es Salaam',
                    'rating'           => 4.5,
                    'total_reviews'    => 21,
                    'total_jobs'       => 38,
                ],
            ],
            [
                'user' => [
                    'name'    => 'Peter Ngowi',
                    'email'   => 'peter.ngowi@fundiconnect.co.tz',
                    'phone'   => '+255754006006',
                    'city'    => 'Dar es Salaam',
                ],
                'profile' => [
                    'category'         => 'Computer Repair',
                    'bio'              => 'IT specialist with experience in hardware repair, networking and software support.',
                    'experience_years' => 4,
                    'hourly_rate'      => 25000,
                    'service_area'     => 'Dar es Salaam',
                    'rating'           => 4.8,
                    'total_reviews'    => 18,
                    'total_jobs'       => 30,
                ],
            ],
            [
                'user' => [
                    'name'    => 'Ali Juma',
                    'email'   => 'ali.juma@fundiconnect.co.tz',
                    'phone'   => '+255754007007',
                    'city'    => 'Dar es Salaam',
                ],
                'profile' => [
                    'category'         => 'CCTV Installation',
                    'bio'              => 'Security systems expert — CCTV, access control, and alarm installations.',
                    'experience_years' => 6,
                    'hourly_rate'      => 30000,
                    'service_area'     => 'Dar es Salaam, Arusha',
                    'rating'           => 4.9,
                    'total_reviews'    => 24,
                    'total_jobs'       => 40,
                ],
            ],
            [
                'user' => [
                    'name'    => 'Michael Banda',
                    'email'   => 'michael.banda@fundiconnect.co.tz',
                    'phone'   => '+255754008008',
                    'city'    => 'Mbeya',
                ],
                'profile' => [
                    'category'         => 'Mechanics',
                    'bio'              => 'Experienced auto mechanic specializing in diagnostics and engine repair.',
                    'experience_years' => 9,
                    'hourly_rate'      => 22000,
                    'service_area'     => 'Mbeya, Iringa',
                    'rating'           => 4.6,
                    'total_reviews'    => 37,
                    'total_jobs'       => 58,
                ],
            ],
        ];

        foreach ($technicians as $data) {
            $user = User::create([
                'name'        => $data['user']['name'],
                'email'       => $data['user']['email'],
                'password'    => Hash::make('password'),
                'role'        => 'technician',
                'phone'       => $data['user']['phone'],
                'city'        => $data['user']['city'],
                'country'     => 'Tanzania',
                'is_active'   => true,
                'is_verified' => true,
            ]);

            $p = $data['profile'];
            Technician::create([
                'user_id'             => $user->id,
                'category_id'         => $categoryIds[$p['category']],
                'bio'                 => $p['bio'],
                'experience_years'    => $p['experience_years'],
                'hourly_rate'         => $p['hourly_rate'],
                'service_area'        => $p['service_area'],
                'rating'              => $p['rating'],
                'total_reviews'       => $p['total_reviews'],
                'total_jobs'          => $p['total_jobs'],
                'verification_status' => 'verified',
                'is_available'        => true,
            ]);
        }
    }
}
