import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonToggle, IonCheckbox, IonRange, IonSearchbar, IonBadge, IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonToggle, IonCheckbox, IonRange, IonSearchbar, IonBadge, IonChip],
})
export class Tab1Page {
  constructor() {

  }
}
