<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('inviteCode');
            $table->string('name'); // Kursa nosaukums
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade'); // Atsauce uz skolotāja ID
            $table->timestamps();
        });
            
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
