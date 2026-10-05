import { Routes } from '@angular/router';
import { ServiceList } from './service-list/service-list';
import { ServiceAdd } from './service-add/service-add';
import { ServiceEdit } from './service-edit/service-edit';
import { ServiceDetails } from './service-details/service-details';

export const serviceRoutes: Routes = [
  { path: '', component: ServiceList, title: 'Services - Car Management System' },
  { path: 'add', component: ServiceAdd, title: 'Book Service - Car Management System' },
  { path: 'edit/:id', component: ServiceEdit, title: 'Edit Service - Car Management System' },
  { path: ':id', component: ServiceDetails, title: 'Service Details - Car Management System' },
];

export const routes: Routes = serviceRoutes;
