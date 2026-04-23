export interface Slot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;
  price: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  customerName: string;
  phoneNumber: string;
  playersCount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: string;
}

export interface DateSlots {
  date: string;
  slots: Slot[];
}
