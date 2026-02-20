<?php

namespace App\Services;

use App\Models\MaintenanceLog;
use Illuminate\Support\Facades\Config;

class MaintenanceService
{
    /**
     * Process and store a maintenance log entry.
     * Automatically calculates interval_km and next_due_km based on service type.
     *
     * @param array $data
     * @return MaintenanceLog
     */
    public function createMaintenanceLog(array $data): MaintenanceLog
    {
        // Auto-detect interval based on service type
        $data = $this->calculateIntervalAndNextDue($data);

        return MaintenanceLog::create($data);
    }

    /**
     * Update an existing maintenance log entry.
     * Recalculates interval_km and next_due_km if service type changes.
     *
     * @param MaintenanceLog $maintenanceLog
     * @param array $data
     * @return MaintenanceLog
     */
    public function updateMaintenanceLog(MaintenanceLog $maintenanceLog, array $data): MaintenanceLog
    {
        // Auto-detect interval based on service type
        $data = $this->calculateIntervalAndNextDue($data);

        $maintenanceLog->update($data);

        return $maintenanceLog->fresh();
    }

    /**
     * Calculate interval_km and next_due_km based on service type and odometer.
     *
     * @param array $data
     * @return array
     */
    protected function calculateIntervalAndNextDue(array $data): array
    {
        $serviceType = $data['service_type'] ?? null;
        $odometerKm = $data['odometer_km'] ?? 0;

        // Get the interval from config if not custom
        if ($serviceType && $serviceType !== 'Custom') {
            $intervals = Config::get('maintenance.service_intervals', []);
            $data['interval_km'] = $intervals[$serviceType] ?? null;
        }

        // Calculate next due km if interval exists
        if (!empty($data['interval_km']) && $odometerKm > 0) {
            $data['next_due_km'] = $odometerKm + $data['interval_km'];
        } else {
            $data['next_due_km'] = null;
        }

        return $data;
    }

    /**
     * Get all service types from config.
     *
     * @return array
     */
    public function getServiceTypes(): array
    {
        return Config::get('maintenance.service_types', []);
    }

    /**
     * Get service intervals configuration.
     *
     * @return array
     */
    public function getServiceIntervals(): array
    {
        return Config::get('maintenance.service_intervals', []);
    }

    /**
     * Get the default interval for a specific service type.
     *
     * @param string $serviceType
     * @return int|null
     */
    public function getDefaultInterval(string $serviceType): ?int
    {
        $intervals = $this->getServiceIntervals();
        return $intervals[$serviceType] ?? null;
    }
}
