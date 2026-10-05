export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  registrationDate: string;
  status: CustomerStatus;
}
