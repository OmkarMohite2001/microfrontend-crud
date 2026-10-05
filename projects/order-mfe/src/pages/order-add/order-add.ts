import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { CrossMfeDataService, CustomerRef, VehicleRef } from '../../services/cross-mfe-data.service';
import { OrderStatus } from '../../Interfaces/order';

@Component({
  selector: 'app-order-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './order-add.html',
  styleUrl: './order-add.scss',
})
export class OrderAdd implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly crossData = inject(CrossMfeDataService);
  private readonly router = inject(Router);

  readonly today = new Date().toISOString().split('T')[0];
  readonly customers = signal<CustomerRef[]>([]);
  readonly selectableVehicles = signal<VehicleRef[]>([]);

  orderForm: FormGroup = this.fb.group({
    orderNumber: [`ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`, [Validators.required]],
    customerId: [null, [Validators.required]],
    vehicleId: [null, [Validators.required]],
    orderDate: [this.today, [Validators.required]],
    amount: [null, [Validators.required, Validators.min(1000)]],
    status: ['Pending' as OrderStatus, [Validators.required]],
  });

  isSubmitted = false;

  get f() {
    return this.orderForm.controls;
  }

  ngOnInit(): void {
    this.customers.set(this.crossData.getCustomers());
    this.selectableVehicles.set(this.crossData.getSelectableVehicles());

    // Listen to vehicle change to auto-fill amount
    this.orderForm.get('vehicleId')?.valueChanges.subscribe((vId) => {
      if (vId) {
        const vehicle = this.crossData.getVehicleById(Number(vId));
        if (vehicle && vehicle.price) {
          this.orderForm.patchValue({ amount: vehicle.price });
        }
      }
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.orderForm.invalid) return;

    const val = this.orderForm.value;
    this.orderService.addOrder({
      orderNumber: val.orderNumber.trim(),
      customerId: Number(val.customerId),
      vehicleId: Number(val.vehicleId),
      orderDate: val.orderDate,
      amount: Number(val.amount),
      status: val.status,
    });

    this.router.navigate(['/orders']);
  }

  onReset(): void {
    this.isSubmitted = false;
    this.orderForm.reset({
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: this.today,
      status: 'Pending',
    });
  }
}
