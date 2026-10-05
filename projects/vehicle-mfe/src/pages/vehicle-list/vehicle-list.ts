import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-list',
  imports: [],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleList {
  
  vehicles = [
    {
      id: 1,
      registrationNumber: 'MH12AB1234',
      brand: 'Tata',
      model: 'Nexon',
      year: 2024
    },
    {
      id: 2,
      registrationNumber: 'MH14CD5678',
      brand: 'Mahindra',
      model: 'XUV700',
      year: 2025
    }
  ];
}
