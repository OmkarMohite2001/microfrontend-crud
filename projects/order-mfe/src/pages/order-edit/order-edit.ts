import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { CrossMfeDataService, CustomerRef, VehicleRef } from '../../services/cross-mfe-data.service';
import { OrderStatus } from '../../Interfaces/order';

@Component({
  selector: 'app-order-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './order-edit.html',
  styleUrl: './order-edit.scss',
})
export class OrderEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly crossData = inject(CrossMfeDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly orderId = signal<number | null>(null);
  readonly notFound = signal<boolean>(false);
  readonly customers = signal<CustomerRef[]>([]);
  readonly selectableVehicles = signal<VehicleRef[]>([]);
  isSubmitted = false;

  orderForm: FormGroup = this.fb.group({
    orderNumber: ['', [Validators.required]],
    customerId: [null, [Validators.required]],
    vehicleId: [null, [Validators.required]],
    orderDate: ['', [Validators.required]],
    amount: [null, [Validators.required, Validators.min(1000)]],
    status: ['Pending' as OrderStatus, [Validators.required]],
  });

  get f() {
    return this.orderForm.controls;
  }

  ngOnInit(): void {
    this.customers.set(this.crossData.getCustomers());

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    this.orderId.set(id);
    const order = this.orderService.getOrderById(id);

    if (!order) {
      this.notFound.set(true);
      return;
    }

    this.selectableVehicles.set(this.crossData.getSelectableVehicles(order.vehicleId));

    this.orderForm.patchValue({
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      vehicleId: order.vehicleId,
      orderDate: order.orderDate,
      amount: order.amount,
      status: order.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.orderForm.invalid || !this.orderId()) return;

    const val = this.orderForm.value;
    const success = this.orderService.updateOrder({
      id: this.orderId()!,
      orderNumber: val.orderNumber.trim(),
      customerId: Number(val.customerId),
      vehicleId: Number(val.vehicleId),
      orderDate: val.orderDate,
      amount: Number(val.amount),
      status: val.status,
    });

    if (success) {
      this.router.navigate(['/orders']);
    }
  }
}
