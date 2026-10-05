import { Injectable } from '@angular/core';

export interface CustomerRef {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface VehicleRef {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  price: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrossMfeDataService {
  getCustomers(): CustomerRef[] {
    try {
      const data = localStorage.getItem('customers');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading customers in Order MFE', e);
    }
    return [];
  }

  getCustomerById(id: number): CustomerRef | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  getCustomerName(id: number): string {
    const c = this.getCustomerById(id);
    return c ? `${c.name} (${c.city})` : `Customer #${id}`;
  }

  getVehicles(): VehicleRef[] {
    try {
      const data = localStorage.getItem('vehicles');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading vehicles in Order MFE', e);
    }
    return [];
  }

  getVehicleById(id: number): VehicleRef | undefined {
    return this.getVehicles().find((v) => v.id === id);
  }

  getVehicleLabel(id: number): string {
    const v = this.getVehicleById(id);
    return v ? `${v.brand} ${v.model} [${v.registrationNumber}]` : `Vehicle #${id}`;
  }

  getSelectableVehicles(currentVehicleId?: number): VehicleRef[] {
    return this.getVehicles().filter(
      (v) => v.status === 'Available' || (currentVehicleId && v.id === currentVehicleId)
    );
  }
}
