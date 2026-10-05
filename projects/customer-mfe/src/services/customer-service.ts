import { Injectable, signal } from '@angular/core';
import { Customer } from '../Interfaces/customer';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98230 11223',
    city: 'Mumbai',
    address: '102 Silver Palms, Andheri West',
    registrationDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98450 33445',
    city: 'Pune',
    address: '45 Green Meadows, Baner Road',
    registrationDate: '2024-02-10',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 99100 55667',
    city: 'New Delhi',
    address: 'C-12 Connaught Place',
    registrationDate: '2024-03-05',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 97410 77889',
    city: 'Bengaluru',
    address: '88 Palm Avenue, Indiranagar',
    registrationDate: '2024-04-12',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Vikram Singh Rathore',
    email: 'vikram.singh@example.com',
    phone: '+91 94140 99001',
    city: 'Jaipur',
    address: '24 Royal Residency, C-Scheme',
    registrationDate: '2024-05-20',
    status: 'Inactive',
  },
  {
    id: 6,
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 98490 22334',
    city: 'Hyderabad',
    address: '14 Cyber Heights, Hitec City',
    registrationDate: '2024-06-18',
    status: 'Active',
  },
];

const STORAGE_KEY = 'customers';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customersState = signal<Customer[]>([]);
  public readonly customers = this.customersState.asReadonly();

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
        this.customersState.set(INITIAL_CUSTOMERS);
      } else {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.customersState.set(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
          this.customersState.set(INITIAL_CUSTOMERS);
        }
      }
    } catch (e) {
      console.error('Error reading customers from localStorage', e);
      this.customersState.set(INITIAL_CUSTOMERS);
    }
  }

  private saveToStorage(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      this.customersState.set(customers);
    } catch (e) {
      console.error('Error saving customers to localStorage', e);
    }
  }

  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.initStorage();
      return this.customersState();
    }
    try {
      const parsed = JSON.parse(data);
      this.customersState.set(parsed);
      return parsed;
    } catch {
      return this.customersState();
    }
  }

  getCustomerById(id: number): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id'>): Customer {
    const list = this.getCustomers();
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    const newCustomer: Customer = {
      ...customer,
      id: maxId + 1,
    };
    const updated = [newCustomer, ...list];
    this.saveToStorage(updated);
    return newCustomer;
  }

  updateCustomer(customer: Customer): boolean {
    const list = this.getCustomers();
    const index = list.findIndex((c) => c.id === customer.id);
    if (index === -1) return false;
    list[index] = { ...customer };
    this.saveToStorage([...list]);
    return true;
  }

  deleteCustomer(id: number): boolean {
    const list = this.getCustomers();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    this.saveToStorage(filtered);
    return true;
  }
}
