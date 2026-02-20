import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/angular/standalone';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  constructor(private vehicleService: VehicleService) { }

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

  onVehicleChange(event: any) {
    const vehicleId = event.detail.value;
    this.selectedVehicle = this.vehicles.find(v => v.id === vehicleId) || null;
  }

  getVehicleDisplayName(vehicle: Vehicle): string {
    return this.vehicleService.getDisplayName(vehicle);
  }

}
