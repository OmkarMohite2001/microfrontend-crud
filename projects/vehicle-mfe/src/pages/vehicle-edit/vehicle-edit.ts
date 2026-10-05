import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle, VehicleStatus } from '../../Interfaces/vehicle';

@Component({
  selector: 'app-vehicle-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-edit.html',
  styleUrl: './vehicle-edit.scss',
})
export class VehicleEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly vehicleId = signal<number | null>(null);
  readonly vehicleNotFound = signal<boolean>(false);
  isSubmitted = false;

  vehicleForm: FormGroup = this.fb.group({
    registrationNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9- ]{5,15}$/i)]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    model: ['', [Validators.required, Validators.minLength(2)]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1980), Validators.max(new Date().getFullYear() + 1)]],
    color: ['', [Validators.required]],
    fuelType: ['Petrol', [Validators.required]],
    price: [null, [Validators.required, Validators.min(1000)]],
    status: ['Available' as VehicleStatus, [Validators.required]],
  });

  get f() {
    return this.vehicleForm.controls;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.vehicleNotFound.set(true);
      return;
    }

    this.vehicleId.set(id);
    const vehicle = this.vehicleService.getVehicleById(id);

    if (!vehicle) {
      this.vehicleNotFound.set(true);
      return;
    }

    this.vehicleForm.patchValue({
      registrationNumber: vehicle.registrationNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      price: vehicle.price,
      status: vehicle.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.vehicleForm.invalid || !this.vehicleId()) {
      return;
    }

    const val = this.vehicleForm.value;
    const success = this.vehicleService.updateVehicle({
      id: this.vehicleId()!,
      registrationNumber: val.registrationNumber.toUpperCase().trim(),
      brand: val.brand.trim(),
      model: val.model.trim(),
      year: Number(val.year),
      color: val.color.trim(),
      fuelType: val.fuelType,
      price: Number(val.price),
      status: val.status,
    });

    if (success) {
      this.router.navigate(['/vehicles']);
    }
  }
}
