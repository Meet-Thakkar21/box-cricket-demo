import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Slot, Sport } from '../types';

interface AppContextType {
  sports: Sport[];
  addSport: (name: string) => Promise<boolean>;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<boolean>;
  getSlotsForDate: (date: string, sportId?: string) => Slot[]; // legacy sync
  fetchSlotsForDate: (date: string, sportId?: string) => Promise<Slot[]>; // new async
  slots: Slot[]; // Base slots
  updateSlotPrice: (slotId: string, newPrice: number) => Promise<void>;
  toggleSlotAvailability: (slotId: string) => Promise<void>;
  updateSlotOverride: (date: string, slotId: string, updates: { price?: number, isAvailable?: boolean }) => Promise<void>;
  deleteSlot: (slotId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  isAdmin: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [slotsRes, bookingsRes, sportsRes] = await Promise.all([
        fetch('/api/slots'),
        fetch('/api/bookings'),
        fetch('/api/sports')
      ]);
      const slotsData = await slotsRes.json();
      const bookingsData = await bookingsRes.json();
      const sportsData = await sportsRes.json();
      
      setSlots(slotsData);
      setBookings(bookingsData);
      setSports(sportsData);
    } catch (e) {
      console.error("Failed to fetch data from backend", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSport = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchData(); // Refresh everything since new slots are created
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const newBooking = await res.json();
      setBookings(prev => [...prev, newBooking]);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const fetchSlotsForDate = async (date: string, sportId?: string): Promise<Slot[]> => {
    try {
      const query = sportId ? `?date=${date}&sportId=${sportId}` : `?date=${date}`;
      const res = await fetch(`/api/slots${query}`);
      const dateSlots: Slot[] = await res.json();
      return dateSlots.map(slot => {
        const isBooked = bookings.some(b => b.date === date && b.slotIds.includes(slot.id));
        return {
          ...slot,
          isBooked,
          isAvailable: slot.isAvailable && !isBooked
        };
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getSlotsForDate = (date: string, sportId?: string): Slot[] => {
    let targetSlots = slots;
    if (sportId) {
      targetSlots = targetSlots.filter(s => s.sportId === sportId);
    }
    return targetSlots.map(slot => {
      const isBooked = bookings.some(b => b.date === date && b.slotIds.includes(slot.id));
      return {
        ...slot,
        isBooked,
        isAvailable: slot.isAvailable && !isBooked
      };
    });
  };

  const updateSlotPrice = async (slotId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/slots/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
      if (res.ok) {
        const updatedSlot = await res.json();
        setSlots(prev => prev.map(s => s.id === slotId ? updatedSlot : s));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSlotAvailability = async (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;
    
    try {
      const res = await fetch(`/api/slots/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !slot.isAvailable }),
      });
      if (res.ok) {
        const updatedSlot = await res.json();
        setSlots(prev => prev.map(s => s.id === slotId ? updatedSlot : s));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateSlotOverride = async (date: string, slotId: string, updates: { price?: number, isAvailable?: boolean }) => {
    try {
      await fetch(`/api/slots/${slotId}/override`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, ...updates }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const res = await fetch(`/api/slots/${slotId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSlots(prev => prev.filter(s => s.id !== slotId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AppContext.Provider value={{
      sports,
      addSport,
      bookings,
      addBooking,
      getSlotsForDate,
      fetchSlotsForDate,
      slots,
      updateSlotPrice,
      toggleSlotAvailability,
      updateSlotOverride,
      deleteSlot,
      cancelBooking,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      isLoading,
      fetchData
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
