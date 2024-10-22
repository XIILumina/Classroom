<?php

namespace Database\Seeders;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
<<<<<<< HEAD

<<<<<<< HEAD
        User::factory()->create([
            "name"=> "admin@admin.admin",
            "email"=> "admin@admin.admin",
            "password"=> bcrypt("admin@admin.admin"),
        ]);

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
=======
=======
        
>>>>>>> 748472978bba2c5a02d891256e1881f59c7cea44
        \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => 'admin',
        ]);
>>>>>>> 9d0b646858d90dc53453305f9f3cbf5afbd20773
    }
}
