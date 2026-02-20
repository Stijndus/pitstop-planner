import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { water, construct } from 'ionicons/icons';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-stats',
  imports: [CommonModule, IonButton, IonIcon],
  templateUrl: './vehicle-stats.component.html',
  styleUrls: ['./vehicle-stats.component.scss'],
})
export class VehicleStatsComponent implements OnInit {

  vehicle = input<Vehicle>({} as Vehicle);

  constructor() {
    addIcons({ water, construct });
  }

  ngOnInit() { }

  logFuel() {
    console.log('Log fuel for vehicle:', this.vehicle());
    // TODO: Navigate to fuel log page or open modal
  }

  logMaintenance() {
    console.log('Log maintenance for vehicle:', this.vehicle());
    // TODO: Navigate to maintenance log page or open modal
  }

}
