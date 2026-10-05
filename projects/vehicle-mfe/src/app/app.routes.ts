import { Routes } from '@angular/router';
import { vehicleRoutes } from '../pages/vehicle.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', children: vehicleRoutes },
  { path: '**', redirectTo: 'vehicles' },
];
