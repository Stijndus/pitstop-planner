import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
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
    ModalController,
} from '@ionic/angular/standalone';
import { MaintenanceService } from '../../services/maintenance.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
    selector: 'app-log-maintenance',
    templateUrl: './log-maintenance.component.html',
    styleUrls: ['./log-maintenance.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
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
    ],
})
export class LogMaintenanceComponent implements OnInit {
    @Input() vehicle!: Vehicle;

    maintenanceForm!: FormGroup;
    serviceTypes: string[] = [];
    serviceIntervals: { [key: string]: number | null } = {};

    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.loadServiceTypes();
        this.setupServiceTypeListener();
    }

    initializeForm() {
        this.maintenanceForm = this.fb.group({
            vehicle_id: [this.vehicle.id, [Validators.required]],
            service_type: ['', [Validators.required]],
            custom_description: [''],
            date_performed: [new Date().toISOString().split('T')[0], [Validators.required]],
            odometer_km: [this.vehicle.odometer, [Validators.required, Validators.min(1)]],
            cost: [null],
            currency: ['EUR'],
            interval_km: [null],
            notes: [''],
        });
    }

    setupServiceTypeListener() {
        this.maintenanceForm.get('service_type')?.valueChanges.subscribe(serviceType => {
            this.onServiceTypeChange(serviceType);
        });
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

    onServiceTypeChange(serviceType: string) {
        const customDescControl = this.maintenanceForm.get('custom_description');
        const intervalControl = this.maintenanceForm.get('interval_km');

        // Update custom_description validation
        if (serviceType === 'Custom') {
            customDescControl?.setValidators([Validators.required]);
            intervalControl?.enable();
            intervalControl?.setValue(null);
        } else {
            customDescControl?.clearValidators();
            customDescControl?.setValue('');

            // Auto-fill interval for non-Custom service types
            const interval = this.serviceIntervals[serviceType];
            if (interval !== null && interval !== undefined) {
                intervalControl?.setValue(interval);
                intervalControl?.disable();
            }
        }

        customDescControl?.updateValueAndValidity();
    }

    get isCustomService(): boolean {
        return this.maintenanceForm.get('service_type')?.value === 'Custom';
    }

    onCancel() {
        this.modalController.dismiss({
            saved: false,
        });
    }

    onSave() {
        this.error = null;

        // Mark all fields as touched to show validation errors
        Object.keys(this.maintenanceForm.controls).forEach(key => {
            this.maintenanceForm.get(key)?.markAsTouched();
        });

        if (this.maintenanceForm.invalid) {
            this.error = 'Please fill in all required fields correctly';
            return;
        }

        this.loading = true;

        // Get form value and include disabled controls (interval_km when not custom)
        const formValue = this.maintenanceForm.getRawValue();

        this.maintenanceService.createMaintenanceLog(formValue).subscribe({
            next: () => {
                this.loading = false;
                this.modalController.dismiss({
                    saved: true,
                });
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Failed to save maintenance log';
                console.error('Error saving maintenance log:', err);
            },
        });
    }

    getErrorMessage(fieldName: string): string {
        const control = this.maintenanceForm.get(fieldName);
        if (control?.hasError('required') && control?.touched) {
            return 'This field is required';
        }
        if (control?.hasError('min') && control?.touched) {
            return 'Value must be greater than 0';
        }
        return '';
    }
}
