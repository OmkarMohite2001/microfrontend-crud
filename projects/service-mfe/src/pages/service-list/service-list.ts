import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceManagementService } from '../../services/service-management.service';
import { CrossMfeVehicleService } from '../../services/cross-mfe-vehicle.service';
import { ServiceRecord } from '../../Interfaces/service-record';

@Component({
  selector: 'app-service-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList {
  private readonly serviceManager = inject(ServiceManagementService);
  readonly crossVehicle = inject(CrossMfeVehicleService);

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('All');
  readonly sortBy = signal<string>('date-desc');
  readonly recordToDelete = signal<ServiceRecord | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly services = this.serviceManager.services;

  readonly filteredServices = computed(() => {
    const list = this.services();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const sort = this.sortBy();

    let result = list.filter((s) => {
      const sNumber = s.serviceNumber.toLowerCase();
      const sType = s.serviceType.toLowerCase();
      const vehLabel = this.crossVehicle.getVehicleLabel(s.vehicleId).toLowerCase();
      const desc = s.description.toLowerCase();

      const matchesSearch =
        !query ||
        sNumber.includes(query) ||
        sType.includes(query) ||
        vehLabel.includes(query) ||
        desc.includes(query);

      const matchesStatus = status === 'All' || s.status === status;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === 'date-desc') return b.serviceDate.localeCompare(a.serviceDate);
      if (sort === 'date-asc') return a.serviceDate.localeCompare(b.serviceDate);
      if (sort === 'cost-desc') return b.cost - a.cost;
      if (sort === 'cost-asc') return a.cost - b.cost;
      return 0;
    });

    return result;
  });

  confirmDelete(record: ServiceRecord): void {
    this.recordToDelete.set(record);
  }

  cancelDelete(): void {
    this.recordToDelete.set(null);
  }

  executeDelete(): void {
    const target = this.recordToDelete();
    if (!target) return;

    this.serviceManager.deleteService(target.id);
    this.recordToDelete.set(null);
    this.showToast(`Service record ${target.serviceNumber} was removed.`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  formatCost(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }
}
