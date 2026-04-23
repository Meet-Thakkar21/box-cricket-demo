import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Slot } from '../types';
import { defaultSlots, initialBookings } from '../data/mockData';

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<boolean>;
  getSlotsForDate: (date: string) => Slot[];
  slots: Slot[]; // Base slots
  updateSlotPrice: (slotId: string, newPrice: number) => void;
  toggleSlotAvailability: (slotId: string) => void;
  isAdmin: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [slots, setSlots] = useState<Slot[]>(defaultSlots);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from local storage on mount (optional but good for mock persistence)
  useEffect(() => {
    const savedBookings = localStorage.getItem('boxCricketBookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error("Failed to parse bookings", e);
      }
    }
  }, []);

  // Save to local storage when bookings change
  useEffect(() => {
    localStorage.setItem('boxCricketBookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if slot is already booked for this date
    const isAlreadyBooked = bookings.some(
      b => b.date === bookingData.date && b.slotId === bookingData.slotId
    );

    if (isAlreadyBooked) {
      throw new Error('Slot is already booked for this date');
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [...prev, newBooking]);
    return true;
  };

  const getSlotsForDate = (date: string): Slot[] => {
    return slots.map(slot => {
      const isBooked = bookings.some(b => b.date === date && b.slotId === slot.id);
      return {
        ...slot,
        isAvailable: slot.isAvailable && !isBooked
      };
    });
  };

  const updateSlotPrice = (slotId: string, newPrice: number) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, price: newPrice } : s));
  };

  const toggleSlotAvailability = (slotId: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isAvailable: !s.isAvailable } : s));
  };

  const loginAdmin = () => setIsAdmin(true);
  const logoutAdmin = () => setIsAdmin(false);

  return (
    <AppContext.Provider value={{
      bookings,
      addBooking,
      getSlotsForDate,
      slots,
      updateSlotPrice,
      toggleSlotAvailability,
      isAdmin,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
