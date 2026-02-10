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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->decimal('fuel_tank_size', 8, 2)->nullable()->after('service_interval');
            $table->enum('fuel_unit', ['L', 'gal'])->default('L')->after('fuel_tank_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['fuel_tank_size', 'fuel_unit']);
        });
    }
};
