import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { water, construct } from 'ionicons/icons';
import { Vehicle } from '../../models/vehicle.model';
import { LogMaintenanceComponent } from '../log-maintenance/log-maintenance.component';

@Component({
  selector: 'app-vehicle-stats',
  imports: [CommonModule, IonButton, IonIcon],
  templateUrl: './vehicle-stats.component.html',
  styleUrls: ['./vehicle-stats.component.scss'],
})
export class VehicleStatsComponent implements OnInit {

  vehicle = input<Vehicle>({} as Vehicle);

  constructor(private modalController: ModalController) {
    addIcons({ water, construct });
  }

  ngOnInit() { }

  logFuel() {
    console.log('Log fuel for vehicle:', this.vehicle());
    // TODO: Navigate to fuel log page or open modal
  }

  async logMaintenance() {
    const modal = await this.modalController.create({
      component: LogMaintenanceComponent,
      componentProps: {
        vehicle: this.vehicle(),
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.saved) {
        console.log('Maintenance log saved successfully');
        // Refresh data or show success message
      }
    });

    await modal.present();
  }

}
