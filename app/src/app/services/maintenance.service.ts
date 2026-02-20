import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
    MaintenanceLog,
    CreateMaintenanceLogData,
    UpdateMaintenanceLogData,
    ServiceTypeConfig
} from '../models/maintenance-log.model';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {

    constructor(private apiService: ApiService) { }

    /**
     * Get all maintenance logs for a specific vehicle
     */
    getMaintenanceLogs(vehicleId: number): Observable<ApiResponse<MaintenanceLog[]>> {
        return this.apiService.get<MaintenanceLog[]>(`vehicles/${vehicleId}/maintenance`);
    }

    /**
     * Get a specific maintenance log by ID
     */
    getMaintenanceLog(id: number): Observable<ApiResponse<MaintenanceLog>> {
        return this.apiService.get<MaintenanceLog>(`maintenance/${id}`);
    }

    /**
     * Create a new maintenance log
     */
    createMaintenanceLog(data: CreateMaintenanceLogData): Observable<ApiResponse<MaintenanceLog>> {
        return this.apiService.post<MaintenanceLog>('maintenance', data);
    }

    /**
     * Update an existing maintenance log
     */
    updateMaintenanceLog(id: number, data: UpdateMaintenanceLogData): Observable<ApiResponse<MaintenanceLog>> {
        return this.apiService.put<MaintenanceLog>(`maintenance/${id}`, data);
    }

    /**
     * Delete a maintenance log
     */
    deleteMaintenanceLog(id: number): Observable<ApiResponse<null>> {
        return this.apiService.delete<null>(`maintenance/${id}`);
    }

    /**
     * Get service types and intervals configuration
     */
    getServiceTypes(): Observable<ApiResponse<ServiceTypeConfig>> {
        return this.apiService.get<ServiceTypeConfig>('maintenance/service-types');
    }

    /**
     * Get status color for dark mode
     */
    getStatusColor(status: string): string {
        switch (status) {
            case 'ok':
                return 'success';
            case 'due-soon':
                return 'warning';
            case 'overdue':
                return 'danger';
            case 'no-interval':
                return 'medium';
            default:
                return 'medium';
        }
    }

    /**
     * Get status label
     */
    getStatusLabel(status: string): string {
        switch (status) {
            case 'ok':
                return 'OK';
            case 'due-soon':
                return 'Due Soon';
            case 'overdue':
                return 'Overdue';
            case 'no-interval':
                return 'No Interval';
            default:
                return 'Unknown';
        }
    }
}
