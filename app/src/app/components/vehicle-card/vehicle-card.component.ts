import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonNote } from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/models/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
    selector: 'app-vehicle-card',
    templateUrl: './vehicle-card.component.html',
    styleUrls: ['./vehicle-card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonNote, IonButton, RouterModule]
})
export class VehicleCardComponent {
    @Input({ required: true }) vehicle!: Vehicle;
    @Output() logFuel = new EventEmitter<{ vehicle: Vehicle; event: Event }>();

    private vehicleService = inject(VehicleService);

    getDisplayName(vehicle: Vehicle): string {
        return this.vehicleService.getDisplayName(vehicle);
    }

    formatOdometer(vehicle: Vehicle): string {
        return this.vehicleService.formatOdometer(vehicle);
    }

    onLogFuel(event: Event): void {
        this.logFuel.emit({ vehicle: this.vehicle, event });
    }
}
