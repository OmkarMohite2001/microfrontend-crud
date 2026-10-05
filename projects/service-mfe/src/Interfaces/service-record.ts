export type ServiceStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ServiceRecord {
  id: number;
  serviceNumber: string;
  vehicleId: number;
  serviceType: string;
  serviceDate: string;
  cost: number;
  status: ServiceStatus;
  description: string;
}
