<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class MaintenanceLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_id',
        'service_type',
        'custom_description',
        'date_performed',
        'odometer_km',
        'cost',
        'currency',
        'interval_km',
        'next_due_km',
        'notes',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_performed' => 'date',
            'cost' => 'decimal:2',
            'odometer_km' => 'integer',
            'interval_km' => 'integer',
            'next_due_km' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the vehicle that owns the maintenance log.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the status of this maintenance item.
     *
     * @return Attribute
     */
    protected function status(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->next_due_km) {
                    return 'no-interval';
                }

                $currentKm = $this->vehicle->odometer ?? 0;

                if ($currentKm >= $this->next_due_km) {
                    return 'overdue';
                }

                if ($currentKm >= $this->next_due_km - 500) {
                    return 'due-soon';
                }

                return 'ok';
            }
        );
    }
}
