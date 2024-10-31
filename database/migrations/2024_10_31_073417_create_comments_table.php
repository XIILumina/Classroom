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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('work_id'); // Reference uz 'works' tabulu
            $table->foreign('work_id')->references('id')->on('works')->onDelete('cascade'); // Foreign key
            $table->text('text'); // Teksts komentāram
            $table->timestamps(); // Izveidošanas un atjaunināšanas laiki
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
