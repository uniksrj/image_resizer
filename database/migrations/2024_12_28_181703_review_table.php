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
        Schema::create('reviewTable', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('username'); // Username field
            $table->integer('rating'); // Rating field
            $table->text('review'); // Review field
            $table->string('geolocation')->nullable(); // Optional geolocation field
            $table->timestamps(); // Created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
