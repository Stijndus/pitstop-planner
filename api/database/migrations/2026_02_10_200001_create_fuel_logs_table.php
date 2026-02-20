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
        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete();
            $table->timestamp('date')->useCurrent();
            $table->decimal('odometer_km', 10, 2);
            $table->decimal('fuel_price_per_unit', 8, 2);
            $table->decimal('fuel_amount', 8, 2);
            $table->decimal('total_cost', 10, 2);
            $table->boolean('is_full_tank')->default(false);
            $table->timestamps();

            // Index for better query performance
            $table->index(['vehicle_id', 'created_at']);
            $table->index(['vehicle_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuel_logs');
    }
};
