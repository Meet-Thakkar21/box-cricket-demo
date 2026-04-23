import React, { useState } from 'react';
import { format, addDays, isPast, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { SlotCard } from '../components/SlotCard';
import { BookingModal } from '../components/BookingModal';
import { useAppContext } from '../context/AppContext';
import { Slot } from '../types';

export const Booking = () => {
  const { getSlotsForDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const slotsForDate = getSlotsForDate(formattedDate);

  const handlePrevDay = () => {
    if (!isToday(selectedDate)) {
      setSelectedDate(prev => addDays(prev, -1));
    }
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isPast(newDate) || isToday(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  // Group slots by time of day
  const morningSlots = slotsForDate.filter(s => parseInt(s.startTime) < 12);
  const afternoonSlots = slotsForDate.filter(s => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17);
  const eveningSlots = slotsForDate.filter(s => parseInt(s.startTime) >= 17);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-neon-blue/10 blur-[120px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Book Your <span className="text-neon-blue">Slot</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select your preferred date and time to reserve the turf. Green slots are available, red ones are already booked.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 mb-10 border-neon-blue/20">
          {/* Date Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-dark-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30">
                <CalendarIcon className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Select Date</h2>
                <p className="text-sm text-gray-400">Choose when you want to play</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-dark-900 p-2 rounded-xl border border-dark-700">
              <button 
                onClick={handlePrevDay}
                disabled={isToday(selectedDate)}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <input 
                  type="date" 
                  value={formattedDate}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={handleDateChange}
                  className="bg-transparent text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-neon-blue rounded px-2 cursor-pointer appearance-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <button 
                onClick={handleNextDay}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="space-y-10">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Morning Sessions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {morningSlots.map(slot => (
                    <SlotCard key={slot.id} slot={slot} onSelect={handleSlotSelect} />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> Afternoon Sessions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {afternoonSlots.map(slot => (
                    <SlotCard key={slot.id} slot={slot} onSelect={handleSlotSelect} />
                  ))}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-purple"></span> Evening & Night Sessions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {eveningSlots.map(slot => (
                    <SlotCard key={slot.id} slot={slot} onSelect={handleSlotSelect} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={selectedSlot}
        date={selectedDate}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
