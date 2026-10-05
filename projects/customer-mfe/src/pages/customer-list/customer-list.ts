import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer-service';
import { Customer } from '../../Interfaces/customer';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList {
  private readonly customerService = inject(CustomerService);

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('All');
  readonly sortBy = signal<string>('name-asc');
  readonly customerToDelete = signal<Customer | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly customers = this.customerService.customers;

  readonly filteredCustomers = computed(() => {
    const list = this.customers();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const sort = this.sortBy();

    let result = list.filter((c) => {
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query);

      const matchesStatus = status === 'All' || c.status === status;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      if (sort === 'date-desc') return b.registrationDate.localeCompare(a.registrationDate);
      if (sort === 'date-asc') return a.registrationDate.localeCompare(b.registrationDate);
      return 0;
    });

    return result;
  });

  confirmDelete(customer: Customer): void {
    this.customerToDelete.set(customer);
  }

  cancelDelete(): void {
    this.customerToDelete.set(null);
  }

  executeDelete(): void {
    const target = this.customerToDelete();
    if (!target) return;

    this.customerService.deleteCustomer(target.id);
    this.customerToDelete.set(null);
    this.showToast(`Customer "${target.name}" was removed.`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
