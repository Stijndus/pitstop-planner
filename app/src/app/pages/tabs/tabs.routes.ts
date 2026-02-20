import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.HomePage)
      },
      {
        path: 'garage',
        loadComponent: () =>
          import('../garage/garage.page').then((m) => m.GaragePage),
      },
      {
        path: 'profile/:userId',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'vehicle/add',
        loadComponent: () =>
          import('../vehicle-form/vehicle-form.page').then((m) => m.VehicleFormPage),
      },
      {
        path: 'vehicle/edit/:id',
        loadComponent: () =>
          import('../vehicle-form/vehicle-form.page').then((m) => m.VehicleFormPage),
      },
      {
        path: '',
        redirectTo: 'garage',
        pathMatch: 'full',
      },
    ],
  },
];
