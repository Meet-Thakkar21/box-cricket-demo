export interface Sport {
  id: string;
  name: string;
}

export interface Slot {
  id: string;
  sportId: string;
  startTime: string; // HH:mm format
  endTime: string;
  price: number;
  isAvailable: boolean;
  isBooked?: boolean;
  bookingStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  sportId: string;
  slotIds: string[]; // Changed from slotId to support multiple slots
  customerName: string;
  phoneNumber: string;
  playersCount?: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  createdAt: string;
}

export interface DateSlots {
  date: string;
  slots: Slot[];
}
