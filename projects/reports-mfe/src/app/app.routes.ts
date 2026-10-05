import { Routes } from '@angular/router';
import { reportsRoutes } from '../pages/reports.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'reports', pathMatch: 'full' },
  { path: 'reports', children: reportsRoutes },
  { path: '**', redirectTo: 'reports' },
];
