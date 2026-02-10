import { Component, EnvironmentInjector, inject, OnInit, signal } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipse, person, personCircleOutline, home, add, heartOutline, paperPlaneOutline, chatbubbleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  userId = signal(1);

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    const cachedUser = this.authService.getUser();
    this.userId.set(cachedUser.id);
  }
}
