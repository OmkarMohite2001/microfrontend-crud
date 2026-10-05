import { Injectable, signal } from '@angular/core';

export interface VehicleReportItem {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  price: number;
  status: 'Available' | 'Sold' | 'Service';
}

export interface CustomerReportItem {
  id: number;
  name: string;
  city: string;
  status: string;
}

export interface OrderReportItem {
  id: number;
  orderNumber: string;
  customerId: number;
  vehicleId: number;
  orderDate: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface ServiceReportItem {
  id: number;
  serviceNumber: string;
  vehicleId: number;
  serviceType: string;
  serviceDate: string;
  cost: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  description: string;
}

export interface AggregatedReports {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  serviceVehicles: number;
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalServiceCost: number;
  netFinancialBalance: number;
  recentOrders: (OrderReportItem & { customerName: string; vehicleName: string })[];
  recentServices: (ServiceReportItem & { vehicleName: string })[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly reportsState = signal<AggregatedReports>(this.computeReports());
  public readonly reports = this.reportsState.asReadonly();

  refresh(): void {
    this.reportsState.set(this.computeReports());
  }

  private readStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(`Error reading ${key} in ReportsService`, e);
    }
    return [];
  }

  private computeReports(): AggregatedReports {
    const vehicles = this.readStorage<VehicleReportItem>('vehicles');
    const customers = this.readStorage<CustomerReportItem>('customers');
    const orders = this.readStorage<OrderReportItem>('orders');
    const services = this.readStorage<ServiceReportItem>('services');

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;
    const soldVehicles = vehicles.filter((v) => v.status === 'Sold').length;
    const serviceVehicles = vehicles.filter((v) => v.status === 'Service').length;

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === 'Active').length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = orders.filter((o) => o.status === 'Completed').length;
    const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

    // Total revenue from confirmed and completed orders
    const totalRevenue = orders
      .filter((o) => o.status === 'Completed' || o.status === 'Confirmed')
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const totalServiceCost = services.reduce((sum, s) => sum + (s.cost || 0), 0);
    const netFinancialBalance = totalRevenue - totalServiceCost;

    // Build enriched recent orders
    const recentOrders = [...orders]
      .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
      .slice(0, 5)
      .map((o) => {
        const cust = customers.find((c) => c.id === o.customerId);
        const veh = vehicles.find((v) => v.id === o.vehicleId);
        return {
          ...o,
          customerName: cust ? cust.name : `Customer #${o.customerId}`,
          vehicleName: veh ? `${veh.brand} ${veh.model}` : `Vehicle #${o.vehicleId}`,
        };
      });

    // Build enriched recent services
    const recentServices = [...services]
      .sort((a, b) => b.serviceDate.localeCompare(a.serviceDate))
      .slice(0, 5)
      .map((s) => {
        const veh = vehicles.find((v) => v.id === s.vehicleId);
        return {
          ...s,
          vehicleName: veh ? `${veh.brand} ${veh.model} [${veh.registrationNumber}]` : `Vehicle #${s.vehicleId}`,
        };
      });

    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      serviceVehicles,
      totalCustomers,
      activeCustomers,
      totalOrders,
      pendingOrders,
      completedOrders,
      confirmedOrders,
      cancelledOrders,
      totalRevenue,
      totalServiceCost,
      netFinancialBalance,
      recentOrders,
      recentServices,
    };
  }
}
