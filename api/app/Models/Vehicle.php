<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'make',
        'model',
        'year',
        'license_plate',
        'odometer',
        'odometer_unit',
        'oil_change_interval',
        'last_service_date',
        'service_interval',
        'fuel_tank_size',
        'fuel_unit',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'average_fuel_consumption',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'odometer' => 'integer',
            'oil_change_interval' => 'integer',
            'service_interval' => 'integer',
            'last_service_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the vehicle.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all fuel logs for the vehicle.
     */
    public function fuelLogs(): HasMany
    {
        return $this->hasMany(FuelLog::class);
    }

    /**
     * Scope to filter active vehicles.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * Scope to filter by make.
     */
    public function scopeByMake($query, string $make)
    {
        return $query->where('make', $make);
    }

    /**
     * Scope to filter by year range.
     */
    public function scopeByYearRange($query, int $startYear, int $endYear)
    {
        return $query->whereBetween('year', [$startYear, $endYear]);
    }

    /**
     * Get the vehicle's display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name ?: "{$this->year} {$this->make} {$this->model}";
    }

    /**
     * Check if vehicle needs oil change.
     */
    public function needsOilChange(): bool
    {
        if (!$this->oil_change_interval) {
            return false;
        }

        // Logic to determine if oil change is needed
        // This is a basic implementation - you may want to track last oil change
        return true;
    }

    /**
     * Check if vehicle needs service.
     */
    public function needsService(): bool
    {
        if (!$this->service_interval || !$this->last_service_date) {
            return false;
        }

        // Basic check - can be enhanced with actual odometer-based logic
        return $this->last_service_date->addMonths(6)->isPast();
    }

    /**
     * Calculate average fuel consumption (L/100km or mpg depending on unit).
     * Returns null if insufficient data.
     */
    public function getAverageFuelConsumptionAttribute(): ?float
    {
        $fullTankLogs = $this->fuelLogs()
            ->where('is_full_tank', true)
            ->orderBy('odometer_km', 'asc')
            ->get();

        if ($fullTankLogs->count() < 2) {
            return null;
        }

        $totalFuel = 0;
        $totalDistance = 0;

        for ($i = 1; $i < $fullTankLogs->count(); $i++) {
            $currentLog = $fullTankLogs[$i];
            $previousLog = $fullTankLogs[$i - 1];

            $distance = $currentLog->odometer_km - $previousLog->odometer_km;

            if ($distance > 0) {
                $totalFuel += $currentLog->fuel_amount;
                $totalDistance += $distance;
            }
        }

        if ($totalDistance <= 0) {
            return null;
        }

        // Calculate L/100km
        $consumption = ($totalFuel / $totalDistance) * 100;

        return round($consumption, 2);
    }
}
