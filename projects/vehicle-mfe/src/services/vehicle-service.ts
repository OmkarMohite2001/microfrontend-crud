import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../Interfaces/vehicle';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 1,
    registrationNumber: 'MH-12-AB-1001',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    color: 'Daytona Grey',
    fuelType: 'Electric',
    price: 1650000,
    status: 'Available',
  },
  {
    id: 2,
    registrationNumber: 'MH-14-CD-2022',
    brand: 'Mahindra',
    model: 'XUV700 AX7',
    year: 2024,
    color: 'Midnight Black',
    fuelType: 'Diesel',
    price: 2450000,
    status: 'Sold',
  },
  {
    id: 3,
    registrationNumber: 'DL-01-EF-3033',
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    year: 2023,
    color: 'Titan Grey',
    fuelType: 'Petrol',
    price: 1780000,
    status: 'Service',
  },
  {
    id: 4,
    registrationNumber: 'KA-03-GH-4044',
    brand: 'Toyota',
    model: 'Innova Hycross',
    year: 2024,
    color: 'Pearl White',
    fuelType: 'Hybrid',
    price: 3120000,
    status: 'Available',
  },
  {
    id: 5,
    registrationNumber: 'TN-09-JK-5055',
    brand: 'MG',
    model: 'ZS EV Exclusive',
    year: 2024,
    color: 'Current Red',
    fuelType: 'Electric',
    price: 2500000,
    status: 'Sold',
  },
  {
    id: 6,
    registrationNumber: 'MH-02-LM-6066',
    brand: 'Kia',
    model: 'Seltos GTX+',
    year: 2023,
    color: 'Gravity Grey',
    fuelType: 'Diesel',
    price: 1950000,
    status: 'Available',
  },
  {
    id: 7,
    registrationNumber: 'HR-26-NO-7077',
    brand: 'BMW',
    model: '330i M Sport',
    year: 2024,
    color: 'Portimao Blue',
    fuelType: 'Petrol',
    price: 5900000,
    status: 'Service',
  },
  {
    id: 8,
    registrationNumber: 'KA-05-PQ-8088',
    brand: 'Skoda',
    model: 'Slavia Style',
    year: 2024,
    color: 'Candy White',
    fuelType: 'Petrol',
    price: 1600000,
    status: 'Available',
  },
];

const STORAGE_KEY = 'vehicles';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly vehiclesState = signal<Vehicle[]>([]);
  public readonly vehicles = this.vehiclesState.asReadonly();

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
        this.vehiclesState.set(INITIAL_VEHICLES);
      } else {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.vehiclesState.set(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
          this.vehiclesState.set(INITIAL_VEHICLES);
        }
      }
    } catch (e) {
      console.error('Error initializing vehicles from localStorage', e);
      this.vehiclesState.set(INITIAL_VEHICLES);
    }
  }

  private saveToStorage(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
      this.vehiclesState.set(vehicles);
    } catch (e) {
      console.error('Error saving vehicles to localStorage', e);
    }
  }

  getVehicles(): Vehicle[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.initStorage();
      return this.vehiclesState();
    }
    try {
      const parsed = JSON.parse(data);
      this.vehiclesState.set(parsed);
      return parsed;
    } catch {
      return this.vehiclesState();
    }
  }

  getVehicleById(id: number): Vehicle | undefined {
    return this.getVehicles().find((v) => v.id === id);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const list = this.getVehicles();
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    const newVehicle: Vehicle = {
      ...vehicle,
      id: maxId + 1,
    };
    const updated = [newVehicle, ...list];
    this.saveToStorage(updated);
    return newVehicle;
  }

  updateVehicle(vehicle: Vehicle): boolean {
    const list = this.getVehicles();
    const index = list.findIndex((v) => v.id === vehicle.id);
    if (index === -1) {
      return false;
    }
    list[index] = { ...vehicle };
    this.saveToStorage([...list]);
    return true;
  }

  deleteVehicle(id: number): boolean {
    const list = this.getVehicles();
    const filtered = list.filter((v) => v.id !== id);
    if (filtered.length === list.length) {
      return false;
    }
    this.saveToStorage(filtered);
    return true;
  }
}
