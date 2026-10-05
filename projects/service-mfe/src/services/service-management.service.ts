import { Injectable, signal } from '@angular/core';
import { ServiceRecord } from '../Interfaces/service-record';

export const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 1,
    serviceNumber: 'SRV-2024-101',
    vehicleId: 3,
    serviceType: 'Periodic Maintenance 30,000 km',
    serviceDate: '2024-10-01',
    cost: 8500,
    status: 'In Progress',
    description: 'Full synthetic engine oil change, brake pad inspection, AC pollen filter replacement.',
  },
  {
    id: 2,
    serviceNumber: 'SRV-2024-102',
    vehicleId: 7,
    serviceType: 'Brake System & Suspension Overhaul',
    serviceDate: '2024-10-03',
    cost: 48000,
    status: 'Pending',
    description: 'Front and rear brake disc replacement with sensor reset and computer wheel alignment.',
  },
  {
    id: 3,
    serviceNumber: 'SRV-2024-103',
    vehicleId: 2,
    serviceType: 'First 10,000 km Inspection',
    serviceDate: '2024-08-14',
    cost: 1500,
    status: 'Completed',
    description: 'General multi-point inspection, coolant top-up, battery health check, ECU diagnostic scan.',
  },
  {
    id: 4,
    serviceNumber: 'SRV-2024-104',
    vehicleId: 5,
    serviceType: 'Battery Health Check & Firmware Update',
    serviceDate: '2024-07-20',
    cost: 4200,
    status: 'Completed',
    description: 'High voltage battery diagnostic test, firmware v2.4 upgrade, regenerative braking test.',
  },
  {
    id: 5,
    serviceNumber: 'SRV-2024-105',
    vehicleId: 1,
    serviceType: 'Dent & Paint Detailing',
    serviceDate: '2024-09-18',
    cost: 12000,
    status: 'Completed',
    description: 'Rear left bumper dent repair, scratch touch-up, and hydrophobic ceramic coating.',
  },
];

const STORAGE_KEY = 'services';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private readonly servicesState = signal<ServiceRecord[]>([]);
  public readonly services = this.servicesState.asReadonly();

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
        this.servicesState.set(INITIAL_SERVICES);
      } else {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.servicesState.set(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
          this.servicesState.set(INITIAL_SERVICES);
        }
      }
    } catch (e) {
      console.error('Error reading services from localStorage', e);
      this.servicesState.set(INITIAL_SERVICES);
    }
  }

  private saveToStorage(records: ServiceRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      this.servicesState.set(records);
    } catch (e) {
      console.error('Error saving services to localStorage', e);
    }
  }

  getServices(): ServiceRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.initStorage();
      return this.servicesState();
    }
    try {
      const parsed = JSON.parse(data);
      this.servicesState.set(parsed);
      return parsed;
    } catch {
      return this.servicesState();
    }
  }

  getServiceById(id: number): ServiceRecord | undefined {
    return this.getServices().find((s) => s.id === id);
  }

  addService(record: Omit<ServiceRecord, 'id'>): ServiceRecord {
    const list = this.getServices();
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    const newRecord: ServiceRecord = {
      ...record,
      id: maxId + 1,
    };
    const updated = [newRecord, ...list];
    this.saveToStorage(updated);
    return newRecord;
  }

  updateService(record: ServiceRecord): boolean {
    const list = this.getServices();
    const index = list.findIndex((s) => s.id === record.id);
    if (index === -1) return false;
    list[index] = { ...record };
    this.saveToStorage([...list]);
    return true;
  }

  deleteService(id: number): boolean {
    const list = this.getServices();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length === list.length) return false;
    this.saveToStorage(filtered);
    return true;
  }
}
