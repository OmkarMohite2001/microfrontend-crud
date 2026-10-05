import { Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { CustomerAdd } from './customer-add/customer-add';
import { CustomerEdit } from './customer-edit/customer-edit';
import { CustomerDetails } from './customer-details/customer-details';

export const customerRoutes: Routes = [
  { path: '', component: CustomerList, title: 'Customers - Car Management System' },
  { path: 'add', component: CustomerAdd, title: 'New Customer - Car Management System' },
  { path: 'edit/:id', component: CustomerEdit, title: 'Edit Customer - Car Management System' },
  { path: ':id', component: CustomerDetails, title: 'Customer Profile - Car Management System' },
];

export const routes: Routes = customerRoutes;
