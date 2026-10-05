import { Routes } from '@angular/router';
import { ReportsDashboard } from './reports-dashboard/reports-dashboard';

export const reportsRoutes: Routes = [
  { path: '', component: ReportsDashboard, title: 'Reports & Analytics - Car Management System' },
];

export const routes: Routes = reportsRoutes;
