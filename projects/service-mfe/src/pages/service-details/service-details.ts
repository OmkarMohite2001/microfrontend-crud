import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceManagementService } from '../../services/service-management.service';
import { CrossMfeVehicleService, VehicleRef } from '../../services/cross-mfe-vehicle.service';
import { ServiceRecord } from '../../Interfaces/service-record';

@Component({
  selector: 'app-service-details',
  imports: [RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.scss',
})
export class ServiceDetails implements OnInit {
  private readonly serviceManager = inject(ServiceManagementService);
  readonly crossVehicle = inject(CrossMfeVehicleService);
  private readonly route = inject(ActivatedRoute);

  readonly record = signal<ServiceRecord | null>(null);
  readonly vehicle = signal<VehicleRef | undefined>(undefined);
  readonly notFound = signal<boolean>(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.notFound.set(true);
      return;
    }

    const found = this.serviceManager.getServiceById(id);
    if (found) {
      this.record.set(found);
      this.vehicle.set(this.crossVehicle.getVehicleById(found.vehicleId));
    } else {
      this.notFound.set(true);
    }
  }

  formatCost(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }
}
