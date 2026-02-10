export interface FuelLog {
    id: number;
    vehicle_id: number;
    date: string;
    odometer_km: number;
    fuel_price_per_unit: number;
    fuel_amount: number;
    total_cost: number;
    is_full_tank: boolean;
    created_at: string;
}

export interface CreateFuelLogData {
    vehicle_id: number;
    date?: string;
    odometer_km: number;
    fuel_price_per_unit: number;
    fuel_amount: number;
    total_cost: number;
    is_full_tank: boolean;
}

export interface UpdateFuelLogData {
    date?: string;
    odometer_km?: number;
    fuel_price_per_unit?: number;
    fuel_amount?: number;
    total_cost?: number;
    is_full_tank?: boolean;
}
