export interface MaintenanceLog {
    id: number;
    vehicle_id: number;
    service_type: string;
    custom_description?: string;
    date_performed: string;
    odometer_km: number;
    cost?: number;
    currency: string;
    interval_km?: number;
    next_due_km?: number;
    notes?: string;
    status: 'ok' | 'due-soon' | 'overdue' | 'no-interval';
    created_at: string;
    updated_at: string;
}

export interface CreateMaintenanceLogData {
    vehicle_id: number;
    service_type: string;
    custom_description?: string;
    date_performed: string;
    odometer_km: number;
    cost?: number;
    currency?: string;
    interval_km?: number;
    notes?: string;
}

export interface UpdateMaintenanceLogData {
    service_type?: string;
    custom_description?: string;
    date_performed?: string;
    odometer_km?: number;
    cost?: number;
    currency?: string;
    interval_km?: number;
    notes?: string;
}

export interface ServiceTypeConfig {
    service_types: string[];
    service_intervals: { [key: string]: number | null };
}
