import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer-service';
import { Customer } from '../../Interfaces/customer';

@Component({
  selector: 'app-customer-details',
  imports: [RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetails implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  readonly customer = signal<Customer | null>(null);
  readonly notFound = signal<boolean>(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    const found = this.customerService.getCustomerById(id);
    if (found) {
      this.customer.set(found);
    } else {
      this.notFound.set(true);
    }
  }
}
