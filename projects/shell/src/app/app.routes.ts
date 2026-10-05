import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { DashboardComponent } from '../pages/dashboard/dashboard';
import { remoteErrorRoutes } from '../pages/remote-error/remote-error';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard - Car Management System',
  },
  {
    path: 'vehicles',
    loadChildren: () =>
      loadRemoteModule('vehicle', './routes')
        .then((m) => m.routes || m.vehicleRoutes)
        .catch((err) => {
          console.error('Failed to load vehicle remote', err);
          return remoteErrorRoutes('Vehicles Microfrontend', 4201, 'start:vehicle');
        }),
  },
  {
    path: 'customers',
    loadChildren: () =>
      loadRemoteModule('customer', './routes')
        .then((m) => m.routes || m.customerRoutes)
        .catch((err) => {
          console.error('Failed to load customer remote', err);
          return remoteErrorRoutes('Customers Microfrontend', 4202, 'start:customer');
        }),
  },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('order', './routes')
        .then((m) => m.routes || m.orderRoutes)
        .catch((err) => {
          console.error('Failed to load order remote', err);
          return remoteErrorRoutes('Orders Microfrontend', 4203, 'start:order');
        }),
  },
  {
    path: 'services',
    loadChildren: () =>
      loadRemoteModule('service', './routes')
        .then((m) => m.routes || m.serviceRoutes)
        .catch((err) => {
          console.error('Failed to load service remote', err);
          return remoteErrorRoutes('Services Microfrontend', 4204, 'start:service');
        }),
  },
  {
    path: 'reports',
    loadChildren: () =>
      loadRemoteModule('reports', './routes')
        .then((m) => m.routes || m.reportsRoutes)
        .catch((err) => {
          console.error('Failed to load reports remote', err);
          return remoteErrorRoutes('Reports Microfrontend', 4205, 'start:reports');
        }),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
