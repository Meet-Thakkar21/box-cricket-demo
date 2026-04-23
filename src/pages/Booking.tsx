import React, { useState } from 'react';
import { format, addDays, isPast, isToday, isAfter, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { SlotCard } from '../components/SlotCard';
import { BookingModal } from '../components/BookingModal';
import { useAppContext } from '../context/AppContext';
import { Slot } from '../types';
import { Button } from '../components/Button';

export const Booking = () => {
  const { fetchSlotsForDate, bookings, slots, sports } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSportId, setSelectedSportId] = useState<string>('');
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [slotsForDate, setSlotsForDate] = useState<Slot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlotsLoading, setIsSlotsLoading] = useState(true);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const maxDate = startOfDay(addDays(new Date(), 7));

  React.useEffect(() => {
    if (sports.length > 0 && !selectedSportId) {
      setSelectedSportId(sports[0].id);
    }
  }, [sports]);

  React.useEffect(() => {
    const loadSlots = async () => {
      if (!selectedSportId) return;
      setIsSlotsLoading(true);
      const dateSlots = await fetchSlotsForDate(formattedDate, selectedSportId);
      setSlotsForDate(dateSlots);
      setIsSlotsLoading(false);
    };
    loadSlots();
  }, [formattedDate, bookings, slots, selectedSportId]);

  const handlePrevDay = () => {
    if (!isToday(selectedDate)) {
      setSelectedDate(prev => addDays(prev, -1));
      setSelectedSlots([]); // Clear selection on day change
    }
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    if (!isAfter(nextDay, maxDate)) {
      setSelectedDate(nextDay);
      setSelectedSlots([]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const newDateStart = startOfDay(newDate);
    if ((!isPast(newDateStart) || isToday(newDateStart)) && !isAfter(newDateStart, maxDate)) {
      setSelectedDate(newDateStart);
      setSelectedSlots([]);
    }
  };

  const handleSlotToggle = (slot: Slot) => {
    setSelectedSlots(prev => {
      const isSelected = prev.find(s => s.id === slot.id);
      if (isSelected) {
        return prev.filter(s => s.id !== slot.id);
      } else {
        return [...prev, slot].sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));
      }
    });
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    setSelectedSlots([]);
  };

  // Group slots by time of day
  const morningSlots = slotsForDate.filter(s => parseInt(s.startTime) < 12);
  const afternoonSlots = slotsForDate.filter(s => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17);
  const eveningSlots = slotsForDate.filter(s => parseInt(s.startTime) >= 17);

  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-light-900 relative z-10">
      {/* Background Image Elements */}
      <div className="absolute inset-0 z-0 bg-white fixed">
        <img 
          src="/turf.webp" 
          alt="Cricket Turf Background" 
          className="w-full h-full object-cover opacity-[0.15]" 
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-light-text mb-4">
            Book Your <span className="text-sports-green">Slot</span>
          </h1>
          <p className="text-light-muted max-w-2xl mx-auto">
            Select up to 7 days in advance. You can select multiple slots for extended playtime.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 mb-10 border-light-600">
          {/* Sport Selector */}
          <div className="flex overflow-x-auto gap-3 mb-8 pb-2 hide-scrollbar">
            {sports.map(sport => (
              <button
                key={sport.id}
                onClick={() => {
                  setSelectedSportId(sport.id);
                  setSelectedSlots([]);
                }}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${
                  selectedSportId === sport.id 
                    ? 'bg-sports-green text-white border-sports-green shadow-md shadow-sports-green/20' 
                    : 'bg-white text-light-muted border-light-600 hover:border-sports-green/50'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>

          {/* Date Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-light-600">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-sports-green/10 flex items-center justify-center border border-sports-green/30">
                <CalendarIcon className="w-6 h-6 text-sports-green" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-light-text">Select Date</h2>
                <p className="text-sm text-light-muted">Booking available up to 1 week ahead</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-light-600 shadow-sm">
              <button 
                onClick={handlePrevDay}
                disabled={isToday(selectedDate)}
                className="p-2 text-light-muted hover:text-light-text disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <input 
                  type="date" 
                  value={formattedDate}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(maxDate, 'yyyy-MM-dd')}
                  onChange={handleDateChange}
                  className="bg-transparent text-light-text font-bold text-center focus:outline-none focus:ring-2 focus:ring-sports-green rounded px-2 cursor-pointer"
                />
              </div>

              <button 
                onClick={handleNextDay}
                disabled={isAfter(addDays(selectedDate, 1), maxDate)}
                className="p-2 text-light-muted hover:text-light-text disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slots Grid */}
          {isSlotsLoading ? (
            <div className="text-center py-20 text-light-muted font-bold animate-pulse">Loading slots...</div>
          ) : (
            <div className="space-y-10">
              {/* Morning */}
              {morningSlots.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-light-text mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sports-yellow"></span> Morning Sessions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {morningSlots.map(slot => (
                      <SlotCard 
                        key={slot.id} 
                        slot={slot} 
                        isSelected={selectedSlots.some(s => s.id === slot.id)}
                        onSelect={handleSlotToggle} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon */}
              {afternoonSlots.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-light-text mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sports-orange"></span> Afternoon Sessions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {afternoonSlots.map(slot => (
                      <SlotCard 
                        key={slot.id} 
                        slot={slot} 
                        isSelected={selectedSlots.some(s => s.id === slot.id)}
                        onSelect={handleSlotToggle} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Evening */}
              {eveningSlots.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-light-text mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sports-green"></span> Evening & Night Sessions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {eveningSlots.map(slot => (
                      <SlotCard 
                        key={slot.id} 
                        slot={slot} 
                        isSelected={selectedSlots.some(s => s.id === slot.id)}
                        onSelect={handleSlotToggle} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar for Multiple Selection */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-light-600 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-light-text font-bold text-lg">
                {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-light-muted text-sm">
                Total Amount: <span className="text-sports-green font-bold text-lg">₹{totalAmount}</span>
              </p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setSelectedSlots([])} className="flex-1 sm:flex-none text-light-text border-light-600 hover:bg-gray-100">
                Clear
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-sports-green hover:bg-sports-green/90 text-white font-bold flex-1 sm:flex-none"
              >
                Proceed to Pay <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSlots={selectedSlots}
        date={selectedDate}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
