import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceManagementService } from '../../services/service-management.service';
import { CrossMfeVehicleService, VehicleRef } from '../../services/cross-mfe-vehicle.service';
import { ServiceStatus } from '../../Interfaces/service-record';

@Component({
  selector: 'app-service-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './service-edit.html',
  styleUrl: './service-edit.scss',
})
export class ServiceEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceManager = inject(ServiceManagementService);
  private readonly crossVehicle = inject(CrossMfeVehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly serviceId = signal<number | null>(null);
  readonly notFound = signal<boolean>(false);
  readonly vehicles = signal<VehicleRef[]>([]);
  isSubmitted = false;

  serviceForm: FormGroup = this.fb.group({
    serviceNumber: ['', [Validators.required]],
    vehicleId: [null, [Validators.required]],
    serviceType: ['', [Validators.required, Validators.minLength(3)]],
    serviceDate: ['', [Validators.required]],
    cost: [null, [Validators.required, Validators.min(0)]],
    status: ['Pending' as ServiceStatus, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(5)]],
  });

  get f() {
    return this.serviceForm.controls;
  }

  ngOnInit(): void {
    this.vehicles.set(this.crossVehicle.getVehicles());

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    this.serviceId.set(id);
    const record = this.serviceManager.getServiceById(id);

    if (!record) {
      this.notFound.set(true);
      return;
    }

    this.serviceForm.patchValue({
      serviceNumber: record.serviceNumber,
      vehicleId: record.vehicleId,
      serviceType: record.serviceType,
      serviceDate: record.serviceDate,
      cost: record.cost,
      status: record.status,
      description: record.description,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.serviceForm.invalid || !this.serviceId()) return;

    const val = this.serviceForm.value;
    const success = this.serviceManager.updateService({
      id: this.serviceId()!,
      serviceNumber: val.serviceNumber.trim(),
      vehicleId: Number(val.vehicleId),
      serviceType: val.serviceType.trim(),
      serviceDate: val.serviceDate,
      cost: Number(val.cost),
      status: val.status,
      description: val.description.trim(),
    });

    if (success) {
      this.router.navigate(['/services']);
    }
  }
}
