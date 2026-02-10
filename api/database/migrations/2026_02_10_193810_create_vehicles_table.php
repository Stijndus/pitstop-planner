<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic Information
            $table->string('name')->nullable(); // User-defined nickname (e.g., "My Beast", "Daily Driver")
            $table->string('make'); // Brand (e.g., "Toyota", "BMW", "Ferrari")
            $table->string('model'); // Model name (e.g., "Supra", "M3", "488 GTB")
            $table->integer('year'); // Year of manufacture
            $table->string('license_plate')->nullable();

            // Odometer & Usage
            $table->integer('odometer')->default(0); // Current mileage
            $table->string('odometer_unit')->default('kilometers'); // 'miles' or 'kilometers'

            // Maintenance
            $table->integer('oil_change_interval')->nullable(); // Miles/KM between changes
            $table->date('last_service_date')->nullable();
            $table->integer('service_interval')->nullable(); // Miles/KM between service


            $table->timestamps();
            $table->softDeletes(); // Soft delete for data retention

            // Indexes for performance
            $table->index(['user_id']);
            $table->index('make');
            $table->index('model');
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
