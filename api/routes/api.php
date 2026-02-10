<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Vehicle routes - protected by JWT authentication
Route::middleware('auth:api')->group(function () {
    // My vehicles (current user)
    Route::get('vehicles/my', [VehicleController::class, 'myVehicles']);
    Route::get('vehicles/statistics', [VehicleController::class, 'statistics']);
    Route::get('vehicles/search', [VehicleController::class, 'search']);

    // Standard CRUD operations
    Route::apiResource('vehicles', VehicleController::class);
});