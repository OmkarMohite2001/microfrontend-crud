import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'vehicles',loadComponent:()=>loadRemoteModule('vehicle','./VehicleList').then(m=>m.VehicleList)}
];
