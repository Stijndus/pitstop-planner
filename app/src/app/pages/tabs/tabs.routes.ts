import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'profile/:userId',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full',
      },
    ],
  },
];
