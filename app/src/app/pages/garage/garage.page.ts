import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonNote, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/models/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { FuelLogService } from 'src/app/services/fuel-log.service';
import { CreateFuelLogData } from 'src/app/models/fuel-log.model';
import { FuelLogModalComponent } from 'src/app/components/fuel-log-modal/fuel-log-modal.component';

@Component({
  selector: 'app-garage',
  templateUrl: 'garage.page.html',
  styleUrls: ['garage.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonNote, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, RouterModule]
})
export class GaragePage implements OnInit {

  private vehiclesService = inject(VehicleService);
  private fuelLogService = inject(FuelLogService);
  private modalController = inject(ModalController);

  public vehicles: WritableSignal<Vehicle[]> = signal([]);
  public isLoading = signal(false);

  constructor() { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading.set(true);
    this.vehiclesService.getMyVehicles().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.vehicles.set(response.data || []);
        } else {
          console.error('Failed to load vehicles:', response.message);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading vehicles:', err);
      }
    });
  }

  getDisplayName(vehicle: Vehicle): string {
    return this.vehiclesService.getDisplayName(vehicle);
  }

  formatOdometer(vehicle: Vehicle): string {
    return this.vehiclesService.formatOdometer(vehicle);
  }

  async openFuelLogModal(vehicle: Vehicle, event: Event) {
    event.stopPropagation();

    // Get the last known mileage from the most recent fuel log
    let lastKnownMileage = 0;
    this.fuelLogService.getLatestFuelLog(vehicle.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          lastKnownMileage = response.data.odometer_km;
        }
      }
    });

    const modal = await this.modalController.create({
      component: FuelLogModalComponent,
      componentProps: {
        vehicle: vehicle,
        lastKnownMileage: lastKnownMileage || vehicle.odometer
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data) {
      this.saveFuelLog(data);
    }
  }

  saveFuelLog(fuelLogData: CreateFuelLogData) {
    this.fuelLogService.createFuelLog(fuelLogData.vehicle_id, fuelLogData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Fuel log saved successfully:', response.data);
          // Optionally show a toast or success message
        } else {
          console.error('Failed to save fuel log:', response.message);
        }
      },
      error: (err) => {
        console.error('Error saving fuel log:', err);
      }
    });
  }
}
