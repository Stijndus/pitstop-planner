<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaintenanceLogRequest;
use App\Http\Requests\UpdateMaintenanceLogRequest;
use App\Http\Responses\ApiResponse;
use App\Models\MaintenanceLog;
use App\Models\Vehicle;
use App\Services\MaintenanceService;
use Illuminate\Http\JsonResponse;

class MaintenanceLogController extends Controller
{
    protected MaintenanceService $maintenanceService;

    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    /**
     * Get all maintenance logs for a specific vehicle.
     *
     * @param int $vehicleId
     * @return JsonResponse
     */
    public function index($vehicleId): JsonResponse
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $maintenanceLogs = $vehicle->maintenanceLogs()
            ->orderBy('date_performed', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($maintenanceLogs);
    }

    /**
     * Store a newly created maintenance log.
     *
     * @param StoreMaintenanceLogRequest $request
     * @return JsonResponse
     */
    public function store(StoreMaintenanceLogRequest $request): JsonResponse
    {
        $vehicleId = $request->input('vehicle_id');
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        // Use the service to create the maintenance log
        $maintenanceLog = $this->maintenanceService->createMaintenanceLog($request->validated());

        return ApiResponse::success($maintenanceLog, 'Maintenance log created successfully', 201);
    }

    /**
     * Display the specified maintenance log.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $maintenanceLog = MaintenanceLog::with('vehicle')->find($id);

        if (!$maintenanceLog) {
            return ApiResponse::error('Maintenance log not found', 404);
        }

        // Check if user owns the vehicle
        if ($maintenanceLog->vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        return ApiResponse::success($maintenanceLog);
    }

    /**
     * Update the specified maintenance log.
     *
     * @param UpdateMaintenanceLogRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateMaintenanceLogRequest $request, $id): JsonResponse
    {
        $maintenanceLog = MaintenanceLog::with('vehicle')->find($id);

        if (!$maintenanceLog) {
            return ApiResponse::error('Maintenance log not found', 404);
        }

        // Check if user owns the vehicle
        if ($maintenanceLog->vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        // Use the service to update the maintenance log
        $maintenanceLog = $this->maintenanceService->updateMaintenanceLog(
            $maintenanceLog,
            $request->validated()
        );

        return ApiResponse::success($maintenanceLog, 'Maintenance log updated successfully');
    }

    /**
     * Remove the specified maintenance log.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $maintenanceLog = MaintenanceLog::with('vehicle')->find($id);

        if (!$maintenanceLog) {
            return ApiResponse::error('Maintenance log not found', 404);
        }

        // Check if user owns the vehicle
        if ($maintenanceLog->vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $maintenanceLog->delete();

        return ApiResponse::success(null, 'Maintenance log deleted successfully');
    }

    /**
     * Get all service types and their intervals.
     *
     * @return JsonResponse
     */
    public function serviceTypes(): JsonResponse
    {
        return ApiResponse::success([
            'service_types' => $this->maintenanceService->getServiceTypes(),
            'service_intervals' => $this->maintenanceService->getServiceIntervals(),
        ]);
    }
}
