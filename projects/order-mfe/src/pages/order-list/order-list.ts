import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { CrossMfeDataService } from '../../services/cross-mfe-data.service';
import { Order } from '../../Interfaces/order';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {
  private readonly orderService = inject(OrderService);
  readonly crossData = inject(CrossMfeDataService);

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('All');
  readonly sortBy = signal<string>('date-desc');
  readonly orderToDelete = signal<Order | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly orders = this.orderService.orders;

  readonly filteredOrders = computed(() => {
    const list = this.orders();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const sort = this.sortBy();

    let result = list.filter((o) => {
      const custName = this.crossData.getCustomerName(o.customerId).toLowerCase();
      const vehName = this.crossData.getVehicleLabel(o.vehicleId).toLowerCase();
      const orderNum = o.orderNumber.toLowerCase();

      const matchesSearch =
        !query ||
        orderNum.includes(query) ||
        custName.includes(query) ||
        vehName.includes(query);

      const matchesStatus = status === 'All' || o.status === status;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === 'date-desc') return b.orderDate.localeCompare(a.orderDate);
      if (sort === 'date-asc') return a.orderDate.localeCompare(b.orderDate);
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  });

  confirmDelete(order: Order): void {
    this.orderToDelete.set(order);
  }

  cancelDelete(): void {
    this.orderToDelete.set(null);
  }

  executeDelete(): void {
    const target = this.orderToDelete();
    if (!target) return;

    this.orderService.deleteOrder(target.id);
    this.orderToDelete.set(null);
    this.showToast(`Order ${target.orderNumber} deleted.`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  formatAmount(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }
}
