<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    /**
     * Get all vehicles for the authenticated user.
     */
    public function myVehicles()
    {
        $vehicles = auth('api')->user()->vehicles()
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($vehicles);
    }

    /**
     * Display a listing of all vehicles (admin/global view).
     */
    public function index()
    {
        $vehicles = Vehicle::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return ApiResponse::success($vehicles);
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'nullable|string|max:255',
            'odometer' => 'nullable|integer|min:0',
            'odometer_unit' => 'nullable|in:miles,kilometers',
            'oil_change_interval' => 'nullable|integer|min:0',
            'last_service_date' => 'nullable|date',
            'service_interval' => 'nullable|integer|min:0',
            'fuel_tank_size' => 'nullable|numeric|min:0',
            'fuel_unit' => 'nullable|in:L,gal',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors(), 422);
        }

        $vehicle = auth('api')->user()->vehicles()->create($request->all());

        return ApiResponse::success($vehicle, 'Vehicle created successfully', 201);
    }

    /**
     * Display the specified vehicle.
     */
    public function show($id)
    {
        $vehicle = Vehicle::with('user')->find($id);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        return ApiResponse::success($vehicle);
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'nullable|string|max:255',
            'odometer' => 'nullable|integer|min:0',
            'odometer_unit' => 'nullable|in:miles,kilometers',
            'oil_change_interval' => 'nullable|integer|min:0',
            'last_service_date' => 'nullable|date',
            'service_interval' => 'nullable|integer|min:0',
            'fuel_tank_size' => 'nullable|numeric|min:0',
            'fuel_unit' => 'nullable|in:L,gal',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors(), 422);
        }

        $vehicle->update($request->all());

        return ApiResponse::success($vehicle, 'Vehicle updated successfully');
    }

    /**
     * Remove the specified vehicle (soft delete).
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return ApiResponse::error('Vehicle not found', 404);
        }

        // Check if user owns this vehicle
        if ($vehicle->user_id !== auth('api')->id()) {
            return ApiResponse::error('Unauthorized access', 403);
        }

        $vehicle->delete();

        return ApiResponse::success(null, 'Vehicle deleted successfully');
    }

    /**
     * Get vehicle statistics for the authenticated user.
     */
    public function statistics()
    {
        $user = auth('api')->user();
        $vehicles = $user->vehicles;

        $stats = [
            'total_vehicles' => $vehicles->count(),
            'total_mileage' => $vehicles->sum('odometer'),
            'vehicles_needing_service' => $vehicles->filter(fn($v) => $v->needsService())->count(),
            'vehicles_needing_oil_change' => $vehicles->filter(fn($v) => $v->needsOilChange())->count(),
            'makes_breakdown' => $vehicles->groupBy('make')->map->count(),
            'average_year' => $vehicles->avg('year') ? round($vehicles->avg('year')) : null,
        ];

        return ApiResponse::success($stats);
    }

    /**
     * Search vehicles by make, model, or year.
     */
    public function search(Request $request)
    {
        $query = auth('api')->user()->vehicles();

        if ($request->has('make')) {
            $query->where('make', 'like', '%' . $request->make . '%');
        }

        if ($request->has('model')) {
            $query->where('model', 'like', '%' . $request->model . '%');
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('year_from') && $request->has('year_to')) {
            $query->byYearRange($request->year_from, $request->year_to);
        }

        $vehicles = $query->orderBy('created_at', 'desc')->get();

        return ApiResponse::success($vehicles);
    }
}
