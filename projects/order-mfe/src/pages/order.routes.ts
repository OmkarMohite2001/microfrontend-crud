import { Routes } from '@angular/router';
import { OrderList } from './order-list/order-list';
import { OrderAdd } from './order-add/order-add';
import { OrderEdit } from './order-edit/order-edit';
import { OrderDetails } from './order-details/order-details';

export const orderRoutes: Routes = [
  { path: '', component: OrderList, title: 'Orders - Car Management System' },
  { path: 'add', component: OrderAdd, title: 'Create Order - Car Management System' },
  { path: 'edit/:id', component: OrderEdit, title: 'Edit Order - Car Management System' },
  { path: ':id', component: OrderDetails, title: 'Order Details - Car Management System' },
];

export const routes: Routes = orderRoutes;
