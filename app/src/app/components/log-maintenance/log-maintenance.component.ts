import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonDatetimeButton,
} from '@ionic/angular/standalone';
import { MaintenanceService } from '../../services/maintenance.service';
import { CreateMaintenanceLogData } from '../../models/maintenance-log.model';
import { Vehicle } from '../../models/vehicle.model';

@Component({
    selector: 'app-log-maintenance',
    templateUrl: './log-maintenance.component.html',
    styleUrls: ['./log-maintenance.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonModal,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        IonItem,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonInput,
        IonTextarea,
        IonDatetime,
        IonDatetimeButton,
    ],
})
export class LogMaintenanceComponent implements OnInit {
    vehicle = input.required<Vehicle>();
    isOpen = input<boolean>(false);
    closed = output<void>();
    saved = output<void>();

    serviceTypes: string[] = [];
    serviceIntervals: { [key: string]: number | null } = {};

    formData: CreateMaintenanceLogData = {
        vehicle_id: 0,
        service_type: '',
        date_performed: new Date().toISOString().split('T')[0],
        odometer_km: 0,
        currency: 'EUR',
    };

    loading = false;
    error: string | null = null;

    constructor(private maintenanceService: MaintenanceService) { }

    ngOnInit() {
        this.loadServiceTypes();
        this.formData.vehicle_id = this.vehicle().id;
        this.formData.odometer_km = this.vehicle().odometer;
    }

    loadServiceTypes() {
        this.maintenanceService.getServiceTypes().subscribe({
            next: (response) => {
                if (response.data) {
                    this.serviceTypes = response.data.service_types;
                    this.serviceIntervals = response.data.service_intervals;
                }
            },
            error: (error) => {
                console.error('Error loading service types:', error);
            },
        });
    }

    onServiceTypeChange() {
        const serviceType = this.formData.service_type;

        // Auto-fill interval for non-Custom service types
        if (serviceType && serviceType !== 'Custom') {
            const interval = this.serviceIntervals[serviceType];
            if (interval !== null && interval !== undefined) {
                this.formData.interval_km = interval;
            }
        } else {
            // Clear interval for Custom
            this.formData.interval_km = undefined;
        }
    }

    get isCustomService(): boolean {
        return this.formData.service_type === 'Custom';
    }

    onCancel() {
        this.resetForm();
        this.closed.emit();
    }

    onSave() {
        this.error = null;
        this.loading = true;

        // Validation
        if (!this.formData.service_type) {
            this.error = 'Service type is required';
            this.loading = false;
            return;
        }

        if (this.isCustomService && !this.formData.custom_description) {
            this.error = 'Description is required for custom service';
            this.loading = false;
            return;
        }

        if (!this.formData.odometer_km || this.formData.odometer_km < 1) {
            this.error = 'Valid odometer reading is required';
            this.loading = false;
            return;
        }

        this.maintenanceService.createMaintenanceLog(this.formData).subscribe({
            next: () => {
                this.loading = false;
                this.resetForm();
                this.saved.emit();
                this.closed.emit();
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Failed to save maintenance log';
                console.error('Error saving maintenance log:', err);
            },
        });
    }

    resetForm() {
        this.formData = {
            vehicle_id: this.vehicle().id,
            service_type: '',
            date_performed: new Date().toISOString().split('T')[0],
            odometer_km: this.vehicle().odometer,
            currency: 'EUR',
        };
        this.error = null;
    }
}
