import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceManagementService } from '../../services/service-management.service';
import { CrossMfeVehicleService, VehicleRef } from '../../services/cross-mfe-vehicle.service';
import { ServiceStatus } from '../../Interfaces/service-record';

@Component({
  selector: 'app-service-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './service-add.html',
  styleUrl: './service-add.scss',
})
export class ServiceAdd implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceManager = inject(ServiceManagementService);
  private readonly crossVehicle = inject(CrossMfeVehicleService);
  private readonly router = inject(Router);

  readonly today = new Date().toISOString().split('T')[0];
  readonly vehicles = signal<VehicleRef[]>([]);

  serviceForm: FormGroup = this.fb.group({
    serviceNumber: [`SRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`, [Validators.required]],
    vehicleId: [null, [Validators.required]],
    serviceType: ['', [Validators.required, Validators.minLength(3)]],
    serviceDate: [this.today, [Validators.required]],
    cost: [null, [Validators.required, Validators.min(0)]],
    status: ['Pending' as ServiceStatus, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(5)]],
  });

  isSubmitted = false;

  get f() {
    return this.serviceForm.controls;
  }

  ngOnInit(): void {
    this.vehicles.set(this.crossVehicle.getVehicles());
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.serviceForm.invalid) return;

    const val = this.serviceForm.value;
    this.serviceManager.addService({
      serviceNumber: val.serviceNumber.trim(),
      vehicleId: Number(val.vehicleId),
      serviceType: val.serviceType.trim(),
      serviceDate: val.serviceDate,
      cost: Number(val.cost),
      status: val.status,
      description: val.description.trim(),
    });

    this.router.navigate(['/services']);
  }

  onReset(): void {
    this.isSubmitted = false;
    this.serviceForm.reset({
      serviceNumber: `SRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      serviceDate: this.today,
      status: 'Pending',
    });
  }
}
