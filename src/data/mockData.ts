import { Slot, Booking } from '../types';
import { format, addDays } from 'date-fns';

const generateDefaultSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const startHour = 6; // 6 AM
  const endHour = 23; // 11 PM

  for (let i = startHour; i < endHour; i++) {
    const id = `slot-${i}`;
    const startTime = `${i.toString().padStart(2, '0')}:00`;
    const endTime = `${(i + 1).toString().padStart(2, '0')}:00`;
    
    // Price variation based on time (evening/night is more expensive)
    let price = 1000;
    if (i >= 18) price = 1500;
    else if (i >= 16) price = 1200;

    slots.push({
      id,
      startTime,
      endTime,
      price,
      isAvailable: true,
    });
  }
  return slots;
};

export const defaultSlots = generateDefaultSlots();

const today = new Date();
const tomorrow = addDays(today, 1);

export const initialBookings: Booking[] = [
  {
    id: 'b-1',
    date: format(today, 'yyyy-MM-dd'),
    slotId: 'slot-18', // 6 PM
    customerName: 'John Doe',
    phoneNumber: '9876543210',
    playersCount: 10,
    paymentStatus: 'completed',
    amount: 1500,
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
  },
  {
    id: 'b-2',
    date: format(today, 'yyyy-MM-dd'),
    slotId: 'slot-19', // 7 PM
    customerName: 'Alice Smith',
    phoneNumber: '9876543211',
    playersCount: 12,
    paymentStatus: 'completed',
    amount: 1500,
    createdAt: new Date(today.getTime() - 40000000).toISOString(),
  },
  {
    id: 'b-3',
    date: format(tomorrow, 'yyyy-MM-dd'),
    slotId: 'slot-7', // 7 AM
    customerName: 'Bob Johnson',
    phoneNumber: '9876543212',
    playersCount: 8,
    paymentStatus: 'pending',
    amount: 1000,
    createdAt: new Date().toISOString(),
  }
];
