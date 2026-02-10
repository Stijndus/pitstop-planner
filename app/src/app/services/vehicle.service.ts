import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
    Vehicle,
    CreateVehicleData,
    UpdateVehicleData,
    VehicleStatistics,
    VehicleSearchParams
} from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private apiService: ApiService) { }

    /**
     * Get all vehicles for the current user
     */
    getMyVehicles(): Observable<ApiResponse<Vehicle[]>> {
        return this.apiService.get<Vehicle[]>('vehicles/my');
    }

    /**
     * Get all vehicles (paginated)
     */
    getAllVehicles(): Observable<ApiResponse<Vehicle[]>> {
        return this.apiService.get<Vehicle[]>('vehicles');
    }

    /**
     * Get a specific vehicle by ID
     */
    getVehicle(id: number): Observable<ApiResponse<Vehicle>> {
        return this.apiService.get<Vehicle>(`vehicles/${id}`);
    }

    /**
     * Create a new vehicle
     */
    createVehicle(data: CreateVehicleData): Observable<ApiResponse<Vehicle>> {
        return this.apiService.post<Vehicle>('vehicles', data);
    }

    /**
     * Update an existing vehicle
     */
    updateVehicle(id: number, data: UpdateVehicleData): Observable<ApiResponse<Vehicle>> {
        return this.apiService.put<Vehicle>(`vehicles/${id}`, data);
    }

    /**
     * Delete a vehicle (soft delete)
     */
    deleteVehicle(id: number): Observable<ApiResponse<null>> {
        return this.apiService.delete<null>(`vehicles/${id}`);
    }

    /**
     * Get vehicle statistics for the current user
     */
    getStatistics(): Observable<ApiResponse<VehicleStatistics>> {
        return this.apiService.get<VehicleStatistics>('vehicles/statistics');
    }

    /**
     * Search vehicles
     */
    searchVehicles(params: VehicleSearchParams): Observable<ApiResponse<Vehicle[]>> {
        const queryParams = new URLSearchParams();

        if (params.make) queryParams.append('make', params.make);
        if (params.model) queryParams.append('model', params.model);
        if (params.year) queryParams.append('year', params.year.toString());
        if (params.year_from) queryParams.append('year_from', params.year_from.toString());
        if (params.year_to) queryParams.append('year_to', params.year_to.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `vehicles/search?${queryString}` : 'vehicles/search';

        return this.apiService.get<Vehicle[]>(endpoint);
    }

    /**
     * Get vehicle display name
     */
    getDisplayName(vehicle: Vehicle): string {
        return vehicle.name || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }

    /**
     * Check if vehicle needs service based on last service date
     */
    needsService(vehicle: Vehicle): boolean {
        if (!vehicle.last_service_date) {
            return false;
        }

        const lastService = new Date(vehicle.last_service_date);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        return lastService < sixMonthsAgo;
    }

    /**
     * Format odometer reading with unit
     */
    formatOdometer(vehicle: Vehicle): string {
        const unit = vehicle.odometer_unit === 'miles' ? 'mi' : 'km';
        return `${vehicle.odometer.toLocaleString()} ${unit}`;
    }

    /**
     * Get vehicle age
     */
    getVehicleAge(vehicle: Vehicle): number {
        return new Date().getFullYear() - vehicle.year;
    }

    /**
     * Check if vehicle is vintage (25+ years old)
     */
    isVintage(vehicle: Vehicle): boolean {
        return this.getVehicleAge(vehicle) >= 25;
    }

    /**
     * Check if vehicle is classic (15-24 years old)
     */
    isClassic(vehicle: Vehicle): boolean {
        const age = this.getVehicleAge(vehicle);
        return age >= 15 && age < 25;
    }
}
