import { Routes } from '@angular/router';
import { orderRoutes } from '../pages/order.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', children: orderRoutes },
  { path: '**', redirectTo: 'orders' },
];
