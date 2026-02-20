import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/models/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { FuelLogService } from 'src/app/services/fuel-log.service';
import { CreateFuelLogData } from 'src/app/models/fuel-log.model';
import { FuelLogModalComponent } from 'src/app/components/fuel-log-modal/fuel-log-modal.component';
import { VehicleCardComponent } from 'src/app/components/vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-garage',
  templateUrl: 'garage.page.html',
  styleUrls: ['garage.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSpinner, RouterModule, VehicleCardComponent]
})
export class GaragePage implements OnInit {

  private vehiclesService = inject(VehicleService);
  private fuelLogService = inject(FuelLogService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

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

  handleLogFuel({ vehicle, event }: { vehicle: Vehicle; event: Event }): void {
    event.stopPropagation();
    this.openFuelLogModal(vehicle);
  }

  async openFuelLogModal(vehicle: Vehicle) {
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
      this.saveFuelLog(data.fuelLogData, data.previousOdometer, vehicle);
    }
  }

  saveFuelLog(fuelLogData: CreateFuelLogData, previousOdometer: number, vehicle: Vehicle) {
    this.fuelLogService.createFuelLog(fuelLogData.vehicle_id, fuelLogData).subscribe({
      next: (response) => {
        if (response.success) {
          const tripMileage = fuelLogData.odometer_km - previousOdometer;
          const fuelAmount = fuelLogData.fuel_amount;
          
          // Calculate consumption based on vehicle's fuel unit
          let consumptionText = '';
          if (tripMileage > 0 && fuelAmount > 0) {
            if (vehicle.fuel_unit === 'gal') {
              // MPG for gallons
              const milesPerGallon = (tripMileage * 0.621371) / fuelAmount;  // Convert km to miles
              consumptionText = ` | ${milesPerGallon.toFixed(1)} MPG`;
            } else {
              // L/100km for liters
              const litersPer100km = (fuelAmount / tripMileage) * 100;
              consumptionText = ` | ${litersPer100km.toFixed(1)} L/100km`;
            }
          }

          const distanceUnit = vehicle.odometer_unit === 'miles' ? 'mi' : 'km';
          const tripDistance = vehicle.odometer_unit === 'miles' 
            ? (tripMileage * 0.621371).toFixed(1) 
            : tripMileage.toFixed(1);

          this.toastController.create({
            message: `Fuel log saved | Trip: ${tripDistance} ${distanceUnit}${consumptionText}`,
            duration: 3500,
            color: 'success'
          }).then(toast => toast.present());

          this.loadVehicles();

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
