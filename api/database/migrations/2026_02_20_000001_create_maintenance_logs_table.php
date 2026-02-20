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
        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');

            // Service Information
            $table->string('service_type'); // Oil Change, Brake Service, etc.
            $table->string('custom_description')->nullable();
            $table->date('date_performed');
            $table->integer('odometer_km');

            // Cost Information
            $table->decimal('cost', 10, 2)->nullable();
            $table->string('currency', 3)->default('EUR');

            // Interval & Scheduling
            $table->integer('interval_km')->nullable();
            $table->integer('next_due_km')->nullable();

            // Additional Notes
            $table->text('notes')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index('vehicle_id');
            $table->index(['vehicle_id', 'odometer_km']);
            $table->index('service_type');
            $table->index('date_performed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};
