import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle, VehicleStatus } from '../../Interfaces/vehicle';

@Component({
  selector: 'app-vehicle-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleList {
  private readonly vehicleService = inject(VehicleService);

  readonly searchQuery = signal<string>('');
  readonly selectedBrand = signal<string>('All');
  readonly selectedStatus = signal<string>('All');
  readonly sortBy = signal<string>('newest');
  readonly isLoading = signal<boolean>(false);
  readonly vehicleToDelete = signal<Vehicle | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly vehicles = this.vehicleService.vehicles;

  readonly availableBrands = computed(() => {
    const list = this.vehicles();
    const set = new Set(list.map((v) => v.brand));
    return ['All', ...Array.from(set).sort()];
  });

  readonly filteredVehicles = computed(() => {
    const list = this.vehicles();
    const query = this.searchQuery().toLowerCase().trim();
    const brand = this.selectedBrand();
    const status = this.selectedStatus();
    const sort = this.sortBy();

    let result = list.filter((v) => {
      const matchesSearch =
        !query ||
        v.registrationNumber.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.color.toLowerCase().includes(query);

      const matchesBrand = brand === 'All' || v.brand === brand;
      const matchesStatus = status === 'All' || v.status === status;

      return matchesSearch && matchesBrand && matchesStatus;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === 'newest') return b.id - a.id;
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'year-desc') return b.year - a.year;
      if (sort === 'brand-asc') return a.brand.localeCompare(b.brand);
      return 0;
    });

    return result;
  });

  confirmDelete(vehicle: Vehicle): void {
    this.vehicleToDelete.set(vehicle);
  }

  cancelDelete(): void {
    this.vehicleToDelete.set(null);
  }

  executeDelete(): void {
    const target = this.vehicleToDelete();
    if (!target) return;

    this.vehicleService.deleteVehicle(target.id);
    this.vehicleToDelete.set(null);
    this.showToast(`Vehicle ${target.registrationNumber} deleted successfully.`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
}
