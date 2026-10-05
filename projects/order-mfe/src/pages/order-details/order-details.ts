import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { CrossMfeDataService, CustomerRef, VehicleRef } from '../../services/cross-mfe-data.service';
import { Order } from '../../Interfaces/order';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly crossData = inject(CrossMfeDataService);
  private readonly route = inject(ActivatedRoute);

  readonly order = signal<Order | null>(null);
  readonly customer = signal<CustomerRef | undefined>(undefined);
  readonly vehicle = signal<VehicleRef | undefined>(undefined);
  readonly notFound = signal<boolean>(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    const found = this.orderService.getOrderById(id);
    if (found) {
      this.order.set(found);
      this.customer.set(this.crossData.getCustomerById(found.customerId));
      this.vehicle.set(this.crossData.getVehicleById(found.vehicleId));
    } else {
      this.notFound.set(true);
    }
  }

  formatAmount(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }
}
