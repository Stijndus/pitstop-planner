import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { water, construct } from 'ionicons/icons';
import { Vehicle } from '../../models/vehicle.model';
import { LogMaintenanceComponent } from '../log-maintenance/log-maintenance.component';

@Component({
  selector: 'app-vehicle-stats',
  imports: [CommonModule, IonButton, IonIcon, LogMaintenanceComponent],
  templateUrl: './vehicle-stats.component.html',
  styleUrls: ['./vehicle-stats.component.scss'],
})
export class VehicleStatsComponent implements OnInit {

  vehicle = input<Vehicle>({} as Vehicle);
  isMaintenanceModalOpen = false;

  constructor() {
    addIcons({ water, construct });
  }

  ngOnInit() { }

  logFuel() {
    console.log('Log fuel for vehicle:', this.vehicle());
    // TODO: Navigate to fuel log page or open modal
  }

  logMaintenance() {
    this.isMaintenanceModalOpen = true;
  }

  onMaintenanceModalClosed() {
    this.isMaintenanceModalOpen = false;
  }

  onMaintenanceSaved() {
    console.log('Maintenance log saved successfully');
    // Refresh data or show success message
  }

}
