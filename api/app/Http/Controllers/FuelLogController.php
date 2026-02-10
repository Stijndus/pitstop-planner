<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\FuelLog;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FuelLogController extends Controller
{
    /**
     * Get all fuel logs for a specific vehicle.
     */
    public function index($vehicleId)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $fuelLogs = $vehicle->fuelLogs()
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($fuelLogs);
    }

    /**
     * Get the latest fuel log for a vehicle.
     */
    public function latest($vehicleId)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $latestFuelLog = $vehicle->fuelLogs()
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$latestFuelLog) {
            return ApiResponse::error('No fuel logs found', 404);
        }

        return ApiResponse::success($latestFuelLog);
    }

    /**
     * Store a newly created fuel log.
     */
    public function store(Request $request, $vehicleId)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'nullable|date',
            'odometer_km' => 'required|numeric|min:0',
            'fuel_price_per_unit' => 'required|numeric|min:0.01',
            'fuel_amount' => 'required|numeric|min:0.01',
            'total_cost' => 'required|numeric|min:0',
            'is_full_tank' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors(), 422);
        }

        // Get the latest fuel log to check odometer
        $latestFuelLog = $vehicle->fuelLogs()
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        $lastKnownMileage = $latestFuelLog ? $latestFuelLog->odometer_km : $vehicle->odometer;

        if ($request->odometer_km <= $lastKnownMileage) {
            return ApiResponse::error('Odometer reading must be greater than the last known mileage (' . $lastKnownMileage . ')', 422);
        }

        $data = $request->all();
        $data['vehicle_id'] = $vehicleId;

        // Set date to now if not provided
        if (!isset($data['date'])) {
            $data['date'] = now();
        }

        $fuelLog = FuelLog::create($data);

        // Update vehicle odometer to the current mileage
        $vehicle->odometer = $request->odometer_km;
        $vehicle->save();

        return ApiResponse::success($fuelLog, 'Fuel log created successfully', 201);
    }

    /**
     * Display the specified fuel log.
     */
    public function show($vehicleId, $id)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $fuelLog = FuelLog::where('vehicle_id', $vehicleId)->find($id);

        if (!$fuelLog) {
            return ApiResponse::error('Fuel log not found', 404);
        }

        return ApiResponse::success($fuelLog);
    }

    /**
     * Update the specified fuel log.
     */
    public function update(Request $request, $vehicleId, $id)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $fuelLog = FuelLog::where('vehicle_id', $vehicleId)->find($id);

        if (!$fuelLog) {
            return ApiResponse::error('Fuel log not found', 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'nullable|date',
            'odometer_km' => 'sometimes|required|numeric|min:0',
            'fuel_price_per_unit' => 'sometimes|required|numeric|min:0.01',
            'fuel_amount' => 'sometimes|required|numeric|min:0.01',
            'total_cost' => 'sometimes|required|numeric|min:0',
            'is_full_tank' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors(), 422);
        }

        $fuelLog->update($request->all());

        // Update vehicle odometer if the fuel log's odometer is higher
        if (isset($request->odometer_km) && $request->odometer_km > $vehicle->odometer) {
            $vehicle->odometer = $request->odometer_km;
            $vehicle->save();
        }

        return ApiResponse::success($fuelLog, 'Fuel log updated successfully');
    }

    /**
     * Remove the specified fuel log.
     */
    public function destroy($vehicleId, $id)
    {
        $vehicle = Vehicle::find($vehicleId);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $fuelLog = FuelLog::where('vehicle_id', $vehicleId)->find($id);

        if (!$fuelLog) {
            return ApiResponse::error('Fuel log not found', 404);
        }

        $fuelLog->delete();

        return ApiResponse::success(null, 'Fuel log deleted successfully');
    }
}
