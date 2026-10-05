export type VehicleStatus = 'Available' | 'Sold' | 'Service';

export interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  price: number;
  status: VehicleStatus;
}
