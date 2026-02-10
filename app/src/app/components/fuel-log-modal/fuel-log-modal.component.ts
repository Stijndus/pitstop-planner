import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonNote,
    IonTitle,
    IonToggle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/models/vehicle.model';
import { CreateFuelLogData } from 'src/app/models/fuel-log.model';

@Component({
    selector: 'app-fuel-log-modal',
    templateUrl: './fuel-log-modal.component.html',
    styleUrls: ['./fuel-log-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonNote,
        IonToggle,
        IonIcon
    ]
})
export class FuelLogModalComponent implements OnInit {
    @Input() vehicle!: Vehicle;
    @Input() lastKnownMileage: number = 0;

    fuelPricePerUnit: number | null = null;
    fuelAmount: number | null = null;
    mileage: number | null = null;
    isFullTankManual: boolean = false;

    totalCost = signal<number>(0);
    isFullTank = signal<boolean>(false);
    validationErrors = signal<string[]>([]);

    constructor(private modalController: ModalController) { }

    ngOnInit() {
        // Initialize mileage with current odometer if available
        if (this.vehicle?.odometer) {
            this.mileage = this.vehicle.odometer;
        }
        // Set last known mileage from the most recent fuel log if provided
        if (this.lastKnownMileage > 0) {
            this.mileage = this.lastKnownMileage;
        }
    }

    onInputChange() {
        this.calculateTotalCost();
        this.checkFullTank();
        this.validate();
    }

    calculateTotalCost() {
        if (this.fuelPricePerUnit && this.fuelAmount) {
            this.totalCost.set(this.fuelPricePerUnit * this.fuelAmount);
        } else {
            this.totalCost.set(0);
        }
    }

    checkFullTank() {
        // Auto-suggest full tank based on 90% threshold, but allow manual override
        if (this.fuelAmount && this.vehicle?.fuel_tank_size) {
            const threshold = this.vehicle.fuel_tank_size * 0.9;
            const autoDetected = this.fuelAmount >= threshold;
            // Only auto-set if not manually changed
            if (autoDetected && !this.isFullTankManual) {
                this.isFullTankManual = true;
            }
            this.isFullTank.set(this.isFullTankManual);
        }
    }

    onFullTankToggle() {
        this.isFullTank.set(this.isFullTankManual);
    }

    validate(): boolean {
        const errors: string[] = [];

        if (!this.fuelPricePerUnit || this.fuelPricePerUnit <= 0) {
            errors.push('Fuel price must be greater than 0');
        }

        if (!this.fuelAmount || this.fuelAmount <= 0) {
            errors.push('Fuel amount must be greater than 0');
        }

        if (!this.mileage || this.mileage <= 0) {
            errors.push('Mileage must be greater than 0');
        } else if (this.lastKnownMileage > 0 && this.mileage <= this.lastKnownMileage) {
            errors.push(`Mileage must be greater than last known mileage (${this.lastKnownMileage})`);
        }

        this.validationErrors.set(errors);
        return errors.length === 0;
    }

    dismiss() {
        this.modalController.dismiss(null, 'cancel');
    }

    save() {
        if (!this.validate()) {
            return;
        }

        const fuelLogData: CreateFuelLogData = {
            vehicle_id: this.vehicle.id,
            date: new Date().toISOString(),
            odometer_km: this.mileage!,
            fuel_price_per_unit: this.fuelPricePerUnit!,
            fuel_amount: this.fuelAmount!,
            total_cost: this.totalCost(),
            is_full_tank: this.isFullTank()
        };

        this.modalController.dismiss(fuelLogData, 'save');
    }

    getFuelUnitLabel(): string {
        return this.vehicle?.fuel_unit === 'gal' ? 'gal' : 'L';
    }

    getOdometerUnitLabel(): string {
        return this.vehicle?.odometer_unit === 'miles' ? 'mi' : 'km';
    }
}
