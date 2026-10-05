import { Routes } from '@angular/router';
import { VehicleList } from './vehicle-list/vehicle-list';
import { VehicleAdd } from './vehicle-add/vehicle-add';
import { VehicleEdit } from './vehicle-edit/vehicle-edit';
import { VehicleDetails } from './vehicle-details/vehicle-details';

export const vehicleRoutes: Routes = [
  { path: '', component: VehicleList, title: 'Vehicles - Car Management System' },
  { path: 'add', component: VehicleAdd, title: 'Add Vehicle - Car Management System' },
  { path: 'edit/:id', component: VehicleEdit, title: 'Edit Vehicle - Car Management System' },
  { path: ':id', component: VehicleDetails, title: 'Vehicle Details - Car Management System' },
];

export const routes: Routes = vehicleRoutes;
