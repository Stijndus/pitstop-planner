import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { FuelLog, CreateFuelLogData, UpdateFuelLogData } from '../models/fuel-log.model';

@Injectable({
    providedIn: 'root'
})
export class FuelLogService {

    constructor(private apiService: ApiService) { }

    /**
     * Get all fuel logs for a specific vehicle
     */
    getFuelLogsForVehicle(vehicleId: number): Observable<ApiResponse<FuelLog[]>> {
        return this.apiService.get<FuelLog[]>(`vehicles/${vehicleId}/fuel-logs`);
    }

    /**
     * Get a specific fuel log by ID
     */
    getFuelLog(vehicleId: number, fuelLogId: number): Observable<ApiResponse<FuelLog>> {
        return this.apiService.get<FuelLog>(`vehicles/${vehicleId}/fuel-logs/${fuelLogId}`);
    }

    /**
     * Create a new fuel log
     */
    createFuelLog(vehicleId: number, data: CreateFuelLogData): Observable<ApiResponse<FuelLog>> {
        return this.apiService.post<FuelLog>(`vehicles/${vehicleId}/fuel-logs`, data);
    }

    /**
     * Update an existing fuel log
     */
    updateFuelLog(vehicleId: number, fuelLogId: number, data: UpdateFuelLogData): Observable<ApiResponse<FuelLog>> {
        return this.apiService.put<FuelLog>(`vehicles/${vehicleId}/fuel-logs/${fuelLogId}`, data);
    }

    /**
     * Delete a fuel log
     */
    deleteFuelLog(vehicleId: number, fuelLogId: number): Observable<ApiResponse<void>> {
        return this.apiService.delete<void>(`vehicles/${vehicleId}/fuel-logs/${fuelLogId}`);
    }

    /**
     * Get the most recent fuel log for a vehicle
     */
    getLatestFuelLog(vehicleId: number): Observable<ApiResponse<FuelLog>> {
        return this.apiService.get<FuelLog>(`vehicles/${vehicleId}/fuel-logs/latest`);
    }
}
