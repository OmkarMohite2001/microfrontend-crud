import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle-service';
import { VehicleStatus } from '../../Interfaces/vehicle';

@Component({
  selector: 'app-vehicle-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-add.html',
  styleUrl: './vehicle-add.scss',
})
export class VehicleAdd {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);

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

  isSubmitted = false;

  get f() {
    return this.vehicleForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }

    const val = this.vehicleForm.value;
    this.vehicleService.addVehicle({
      registrationNumber: val.registrationNumber.toUpperCase().trim(),
      brand: val.brand.trim(),
      model: val.model.trim(),
      year: Number(val.year),
      color: val.color.trim(),
      fuelType: val.fuelType,
      price: Number(val.price),
      status: val.status,
    });

    this.router.navigate(['/vehicles']);
  }

  onReset(): void {
    this.isSubmitted = false;
    this.vehicleForm.reset({
      year: new Date().getFullYear(),
      fuelType: 'Petrol',
      status: 'Available',
    });
  }
}
