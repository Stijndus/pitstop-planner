import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, PickerController } from '@ionic/angular/standalone';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleStatsComponent } from "src/app/components/vehicle-stats/vehicle-stats.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule, VehicleStatsComponent]
})
export class HomePage implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  constructor(
    private vehicleService: VehicleService,
    private pickerController: PickerController
  ) { }

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getMyVehicles().subscribe({
      next: (response) => {
        this.vehicles = response.data || [];
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  async openVehiclePicker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'vehicle',
          options: this.vehicles.map(vehicle => ({
            text: this.getVehicleDisplayName(vehicle),
            value: vehicle.id
          }))
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            const vehicleId = value.vehicle.value;
            this.selectedVehicle = this.vehicles.find(v => v.id === vehicleId) || null;
          }
        }
      ]
    });

    await picker.present();
  }

  getVehicleDisplayName(vehicle: Vehicle): string {
    return this.vehicleService.getDisplayName(vehicle);
  }

}
