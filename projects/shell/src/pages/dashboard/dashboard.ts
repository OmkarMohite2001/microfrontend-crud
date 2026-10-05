import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface VehicleSummary {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  price: number;
  status: string;
}

interface CustomerSummary {
  id: number;
  name: string;
  city: string;
}

interface OrderSummary {
  id: number;
  orderNumber: string;
  customerId: number;
  vehicleId: number;
  orderDate: string;
  amount: number;
  status: string;
}

interface ServiceSummary {
  id: number;
  serviceNumber: string;
  status: string;
}

const DEFAULT_VEHICLES = [
  { id: 1, registrationNumber: 'MH-12-AB-1001', brand: 'Tata', model: 'Nexon EV', year: 2024, color: 'Daytona Grey', fuelType: 'Electric', price: 1650000, status: 'Available' },
  { id: 2, registrationNumber: 'MH-14-CD-2022', brand: 'Mahindra', model: 'XUV700 AX7', year: 2024, color: 'Midnight Black', fuelType: 'Diesel', price: 2450000, status: 'Sold' },
  { id: 3, registrationNumber: 'DL-01-EF-3033', brand: 'Hyundai', model: 'Creta SX(O)', year: 2023, color: 'Titan Grey', fuelType: 'Petrol', price: 1780000, status: 'Service' },
  { id: 4, registrationNumber: 'KA-03-GH-4044', brand: 'Toyota', model: 'Innova Hycross', year: 2024, color: 'Pearl White', fuelType: 'Hybrid', price: 3120000, status: 'Available' },
  { id: 5, registrationNumber: 'TN-09-JK-5055', brand: 'MG', model: 'ZS EV Exclusive', year: 2024, color: 'Current Red', fuelType: 'Electric', price: 2500000, status: 'Sold' },
  { id: 6, registrationNumber: 'MH-02-LM-6066', brand: 'Kia', model: 'Seltos GTX+', year: 2023, color: 'Gravity Grey', fuelType: 'Diesel', price: 1950000, status: 'Available' },
  { id: 7, registrationNumber: 'HR-26-NO-7077', brand: 'BMW', model: '330i M Sport', year: 2024, color: 'Portimao Blue', fuelType: 'Petrol', price: 5900000, status: 'Service' },
  { id: 8, registrationNumber: 'KA-05-PQ-8088', brand: 'Skoda', model: 'Slavia Style', year: 2024, color: 'Candy White', fuelType: 'Petrol', price: 1600000, status: 'Available' }
];

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', phone: '+91 98230 11223', city: 'Mumbai', address: '102 Silver Palms, Andheri West', registrationDate: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98450 33445', city: 'Pune', address: '45 Green Meadows, Baner Road', registrationDate: '2024-02-10', status: 'Active' },
  { id: 3, name: 'Amit Verma', email: 'amit.verma@example.com', phone: '+91 99100 55667', city: 'New Delhi', address: 'C-12 Connaught Place', registrationDate: '2024-03-05', status: 'Active' },
  { id: 4, name: 'Ananya Iyer', email: 'ananya.iyer@example.com', phone: '+91 97410 77889', city: 'Bengaluru', address: '88 Palm Avenue, Indiranagar', registrationDate: '2024-04-12', status: 'Active' },
  { id: 5, name: 'Vikram Singh Rathore', email: 'vikram.singh@example.com', phone: '+91 94140 99001', city: 'Jaipur', address: '24 Royal Residency, C-Scheme', registrationDate: '2024-05-20', status: 'Inactive' },
  { id: 6, name: 'Sunita Rao', email: 'sunita.rao@example.com', phone: '+91 98490 22334', city: 'Hyderabad', address: '14 Cyber Heights, Hitec City', registrationDate: '2024-06-18', status: 'Active' }
];

const DEFAULT_ORDERS = [
  { id: 1, orderNumber: 'ORD-2024-001', customerId: 1, vehicleId: 2, orderDate: '2024-02-15', amount: 2450000, status: 'Completed' },
  { id: 2, orderNumber: 'ORD-2024-002', customerId: 2, vehicleId: 5, orderDate: '2024-03-22', amount: 2500000, status: 'Completed' },
  { id: 3, orderNumber: 'ORD-2024-003', customerId: 4, vehicleId: 1, orderDate: '2024-09-10', amount: 1650000, status: 'Confirmed' },
  { id: 4, orderNumber: 'ORD-2024-004', customerId: 3, vehicleId: 4, orderDate: '2024-09-28', amount: 3120000, status: 'Pending' },
  { id: 5, orderNumber: 'ORD-2024-005', customerId: 6, vehicleId: 6, orderDate: '2024-10-02', amount: 1950000, status: 'Cancelled' }
];

const DEFAULT_SERVICES = [
  { id: 1, serviceNumber: 'SRV-2024-101', vehicleId: 3, serviceType: 'Periodic Maintenance 30,000 km', serviceDate: '2024-10-01', cost: 8500, status: 'In Progress', description: 'Full synthetic engine oil change, brake pad inspection, AC pollen filter replacement.' },
  { id: 2, serviceNumber: 'SRV-2024-102', vehicleId: 7, serviceType: 'Brake System & Suspension Overhaul', serviceDate: '2024-10-03', cost: 48000, status: 'Pending', description: 'Front and rear brake disc replacement with sensor reset and computer wheel alignment.' },
  { id: 3, serviceNumber: 'SRV-2024-103', vehicleId: 2, serviceType: 'First 10,000 km Inspection', serviceDate: '2024-08-14', cost: 1500, status: 'Completed', description: 'General multi-point inspection, coolant top-up, battery health check, ECU diagnostic scan.' },
  { id: 4, serviceNumber: 'SRV-2024-104', vehicleId: 5, serviceType: 'Battery Health Check & Firmware Update', serviceDate: '2024-07-20', cost: 4200, status: 'Completed', description: 'High voltage battery diagnostic test, firmware v2.4 upgrade, regenerative braking test.' },
  { id: 5, serviceNumber: 'SRV-2024-105', vehicleId: 1, serviceType: 'Dent & Paint Detailing', serviceDate: '2024-09-18', cost: 12000, status: 'Completed', description: 'Rear left bumper dent repair, scratch touch-up, and hydrophobic ceramic coating.' }
];

@Component({
  selector: 'app-shell-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  readonly vehicles = signal<VehicleSummary[]>([]);
  readonly customers = signal<CustomerSummary[]>([]);
  readonly orders = signal<OrderSummary[]>([]);
  readonly services = signal<ServiceSummary[]>([]);

  readonly totalVehicles = computed(() => this.vehicles().length);
  readonly totalCustomers = computed(() => this.customers().length);
  readonly totalOrders = computed(() => this.orders().length);
  readonly servicePendingCount = computed(
    () => this.services().filter((s) => s.status === 'Pending' || s.status === 'In Progress').length
  );

  readonly recentVehicles = computed(() => this.vehicles().slice(0, 4));

  readonly recentOrdersWithDetails = computed(() => {
    const custs = this.customers();
    const vehs = this.vehicles();
    return this.orders()
      .slice(0, 4)
      .map((o) => {
        const cust = custs.find((c) => c.id === o.customerId);
        const veh = vehs.find((v) => v.id === o.vehicleId);
        return {
          ...o,
          customerName: cust ? cust.name : `Customer #${o.customerId}`,
          vehicleName: veh ? `${veh.brand} ${veh.model}` : `Vehicle #${o.vehicleId}`,
        };
      });
  });

  ngOnInit(): void {
    this.ensureSeedData();
    this.loadData();
  }

  private ensureSeedData(): void {
    try {
      if (!localStorage.getItem('vehicles')) {
        localStorage.setItem('vehicles', JSON.stringify(DEFAULT_VEHICLES));
      }
      if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify(DEFAULT_CUSTOMERS));
      }
      if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(DEFAULT_ORDERS));
      }
      if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify(DEFAULT_SERVICES));
      }
    } catch (e) {
      console.error('Error seeding initial data', e);
    }
  }

  loadData(): void {
    try {
      const vData = localStorage.getItem('vehicles');
      if (vData) this.vehicles.set(JSON.parse(vData));

      const cData = localStorage.getItem('customers');
      if (cData) this.customers.set(JSON.parse(cData));

      const oData = localStorage.getItem('orders');
      if (oData) this.orders.set(JSON.parse(oData));

      const sData = localStorage.getItem('services');
      if (sData) this.services.set(JSON.parse(sData));
    } catch (e) {
      console.error('Error loading dashboard data from localStorage', e);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
}
