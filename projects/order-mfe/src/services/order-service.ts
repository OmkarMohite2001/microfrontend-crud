import { Injectable, signal } from '@angular/core';
import { Order } from '../Interfaces/order';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    customerId: 1,
    vehicleId: 2,
    orderDate: '2024-02-15',
    amount: 2450000,
    status: 'Completed',
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    customerId: 2,
    vehicleId: 5,
    orderDate: '2024-03-22',
    amount: 2500000,
    status: 'Completed',
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    customerId: 4,
    vehicleId: 1,
    orderDate: '2024-09-10',
    amount: 1650000,
    status: 'Confirmed',
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    customerId: 3,
    vehicleId: 4,
    orderDate: '2024-09-28',
    amount: 3120000,
    status: 'Pending',
  },
  {
    id: 5,
    orderNumber: 'ORD-2024-005',
    customerId: 6,
    vehicleId: 6,
    orderDate: '2024-10-02',
    amount: 1950000,
    status: 'Cancelled',
  },
];

const STORAGE_KEY = 'orders';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ordersState = signal<Order[]>([]);
  public readonly orders = this.ordersState.asReadonly();

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
        this.ordersState.set(INITIAL_ORDERS);
      } else {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.ordersState.set(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
          this.ordersState.set(INITIAL_ORDERS);
        }
      }
    } catch (e) {
      console.error('Error reading orders from localStorage', e);
      this.ordersState.set(INITIAL_ORDERS);
    }
  }

  private saveToStorage(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      this.ordersState.set(orders);
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }

  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.initStorage();
      return this.ordersState();
    }
    try {
      const parsed = JSON.parse(data);
      this.ordersState.set(parsed);
      return parsed;
    } catch {
      return this.ordersState();
    }
  }

  getOrderById(id: number): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  addOrder(order: Omit<Order, 'id'>): Order {
    const list = this.getOrders();
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    const newOrder: Order = {
      ...order,
      id: maxId + 1,
    };
    const updated = [newOrder, ...list];
    this.saveToStorage(updated);
    return newOrder;
  }

  updateOrder(order: Order): boolean {
    const list = this.getOrders();
    const index = list.findIndex((o) => o.id === order.id);
    if (index === -1) return false;
    list[index] = { ...order };
    this.saveToStorage([...list]);
    return true;
  }

  deleteOrder(id: number): boolean {
    const list = this.getOrders();
    const filtered = list.filter((o) => o.id !== id);
    if (filtered.length === list.length) return false;
    this.saveToStorage(filtered);
    return true;
  }
}
