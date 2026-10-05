import { Routes } from '@angular/router';
import { serviceRoutes } from '../pages/service.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: 'services', children: serviceRoutes },
  { path: '**', redirectTo: 'services' },
];
