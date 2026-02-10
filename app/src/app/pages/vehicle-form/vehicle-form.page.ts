import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VehicleService } from '../../services/vehicle.service';
import { CreateVehicleData, Vehicle } from '../../models/vehicle.model';

@Component({
    selector: 'app-vehicle-form',
    templateUrl: './vehicle-form.page.html',
    styleUrls: ['./vehicle-form.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class VehicleFormPage implements OnInit {
    vehicleData: CreateVehicleData = {
        name: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        odometer: 0,
        odometer_unit: 'kilometers',
        oil_change_interval: undefined,
        last_service_date: undefined,
        service_interval: undefined,
        fuel_tank_size: undefined,
        fuel_unit: 'L'
    };

    isEditMode = false;
    vehicleId?: number;
    isLoading = false;
    errorMessage = '';
    currentYear = new Date().getFullYear();

    // Popular makes for quick selection
    popularMakes = [
        'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
        'Audi', 'Volkswagen', 'Nissan', 'Mazda', 'Subaru', 'Porsche',
        'Ferrari', 'Lamborghini', 'Tesla', 'Lexus', 'Hyundai', 'Kia'
    ];

    constructor(
        private vehicleService: VehicleService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Check if we're in edit mode
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.vehicleId = parseInt(id, 10);
            this.loadVehicle();
        }
    }

    loadVehicle() {
        if (!this.vehicleId) return;

        this.isLoading = true;
        this.vehicleService.getVehicle(this.vehicleId).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.data) {
                    const vehicle = response.data;
                    this.vehicleData = {
                        name: vehicle.name || '',
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year,
                        license_plate: vehicle.license_plate || '',
                        odometer: vehicle.odometer,
                        odometer_unit: vehicle.odometer_unit,
                        oil_change_interval: vehicle.oil_change_interval,
                        last_service_date: vehicle.last_service_date,
                        service_interval: vehicle.service_interval,
                        fuel_tank_size: vehicle.fuel_tank_size,
                        fuel_unit: vehicle.fuel_unit || 'L'
                    };
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Failed to load vehicle';
                console.error('Load vehicle error:', error);
            }
        });
    }

    onSubmit() {
        // Validate required fields
        if (!this.vehicleData.make || !this.vehicleData.model || !this.vehicleData.year) {
            this.errorMessage = 'Please fill in all required fields';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const request = this.isEditMode && this.vehicleId
            ? this.vehicleService.updateVehicle(this.vehicleId, this.vehicleData)
            : this.vehicleService.createVehicle(this.vehicleData);

        request.subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigate(['/tabs/garage']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} vehicle`;
                console.error('Submit error:', error);
            }
        });
    }

    onCancel() {
        this.router.navigate(['/tabs/garage']);
    }

    generateYears(): number[] {
        const years: number[] = [];
        const startYear = 1950;
        const endYear = this.currentYear + 1;
        for (let year = endYear; year >= startYear; year--) {
            years.push(year);
        }
        return years;
    }
}
