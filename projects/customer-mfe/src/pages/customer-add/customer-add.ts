import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer-service';
import { CustomerStatus } from '../../Interfaces/customer';

@Component({
  selector: 'app-customer-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-add.html',
  styleUrl: './customer-add.scss',
})
export class CustomerAdd {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  readonly today = new Date().toISOString().split('T')[0];

  customerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+() -]{7,20}$/)]],
    city: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    registrationDate: [this.today, [Validators.required]],
    status: ['Active' as CustomerStatus, [Validators.required]],
  });

  isSubmitted = false;

  get f() {
    return this.customerForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.customerForm.invalid) return;

    const val = this.customerForm.value;
    this.customerService.addCustomer({
      name: val.name.trim(),
      email: val.email.trim(),
      phone: val.phone.trim(),
      city: val.city.trim(),
      address: val.address.trim(),
      registrationDate: val.registrationDate,
      status: val.status,
    });

    this.router.navigate(['/customers']);
  }

  onReset(): void {
    this.isSubmitted = false;
    this.customerForm.reset({
      registrationDate: this.today,
      status: 'Active',
    });
  }
}
