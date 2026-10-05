import { Routes } from '@angular/router';
import { customerRoutes } from '../pages/customer.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', children: customerRoutes },
  { path: '**', redirectTo: 'customers' },
];
