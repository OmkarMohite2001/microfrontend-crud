import { Injectable } from '@angular/core';

export interface VehicleRef {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrossMfeVehicleService {
  getVehicles(): VehicleRef[] {
    try {
      const data = localStorage.getItem('vehicles');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading vehicles in Service MFE', e);
    }
    return [];
  }

  getVehicleById(id: number): VehicleRef | undefined {
    return this.getVehicles().find((v) => v.id === id);
  }

  getVehicleLabel(id: number): string {
    const v = this.getVehicleById(id);
    return v ? `${v.brand} ${v.model} (${v.registrationNumber})` : `Vehicle #${id}`;
  }
}
