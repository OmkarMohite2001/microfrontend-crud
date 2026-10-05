import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer-service';
import { CustomerStatus } from '../../Interfaces/customer';

@Component({
  selector: 'app-customer-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-edit.html',
  styleUrl: './customer-edit.scss',
})
export class CustomerEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly customerId = signal<number | null>(null);
  readonly notFound = signal<boolean>(false);
  isSubmitted = false;

  customerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+() -]{7,20}$/)]],
    city: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    registrationDate: ['', [Validators.required]],
    status: ['Active' as CustomerStatus, [Validators.required]],
  });

  get f() {
    return this.customerForm.controls;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    this.customerId.set(id);
    const customer = this.customerService.getCustomerById(id);

    if (!customer) {
      this.notFound.set(true);
      return;
    }

    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      address: customer.address,
      registrationDate: customer.registrationDate,
      status: customer.status,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.customerForm.invalid || !this.customerId()) return;

    const val = this.customerForm.value;
    const success = this.customerService.updateCustomer({
      id: this.customerId()!,
      name: val.name.trim(),
      email: val.email.trim(),
      phone: val.phone.trim(),
      city: val.city.trim(),
      address: val.address.trim(),
      registrationDate: val.registrationDate,
      status: val.status,
    });

    if (success) {
      this.router.navigate(['/customers']);
    }
  }
}
