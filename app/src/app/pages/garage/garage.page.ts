import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNote, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/models/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';

@Component({
  selector: 'app-garage',
  templateUrl: 'garage.page.html',
  styleUrls: ['garage.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonNote, IonBadge, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, RouterModule, ExploreContainerComponent]
})
export class GaragePage implements OnInit {

  private vehiclesService = inject(VehicleService);

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
}
