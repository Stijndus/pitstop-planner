export interface Vehicle {
    id: number;
    user_id: number;
    name?: string;
    make: string;
    model: string;
    year: number;
    license_plate?: string;
    odometer: number;
    odometer_unit: 'miles' | 'kilometers';

    average_fuel_consumption: number;
    oil_change_interval?: number;
    last_service_date?: string;
    service_interval?: number;
    fuel_tank_size?: number;
    fuel_unit?: 'L' | 'gal';
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface CreateVehicleData {
    name?: string;
    make: string;
    model: string;
    year: number;
    license_plate?: string;
    odometer?: number;
    odometer_unit?: 'miles' | 'kilometers';
    oil_change_interval?: number;
    last_service_date?: string;
    service_interval?: number;
    fuel_tank_size?: number;
    fuel_unit?: 'L' | 'gal';
}

export interface UpdateVehicleData {
    name?: string;
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
    odometer?: number;
    odometer_unit?: 'miles' | 'kilometers';
    oil_change_interval?: number;
    last_service_date?: string;
    service_interval?: number;
    fuel_tank_size?: number;
    fuel_unit?: 'L' | 'gal';
}

export interface VehicleStatistics {
    total_vehicles: number;
    total_mileage: number;
    vehicles_needing_service: number;
    vehicles_needing_oil_change: number;
    makes_breakdown: { [key: string]: number };
    average_year: number | null;
}

export interface VehicleSearchParams {
    make?: string;
    model?: string;
    year?: number;
    year_from?: number;
    year_to?: number;
}
