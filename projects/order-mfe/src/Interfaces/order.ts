export type OrderStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  vehicleId: number;
  orderDate: string;
  amount: number;
  status: OrderStatus;
}
