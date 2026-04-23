import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, Users, Phone, User } from 'lucide-react';
import { Slot } from '../types';
import { Button } from './Button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: Slot[];
  date: Date;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedSlots, date, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    playersCount: 10,
  });

  if (!isOpen || selectedSlots.length === 0) return null;

  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare temporary booking data
    const bookingData = {
      date: format(date, 'yyyy-MM-dd'),
      sportId: selectedSlots[0].sportId,
      slotIds: selectedSlots.map(s => s.id),
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      playersCount: Number(formData.playersCount),
      amount: totalAmount,
    };

    // Navigate to payment page with booking details
    onSuccess();
    navigate('/payment', { state: { bookingData, selectedSlots } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white border border-light-600 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-600 bg-gray-50">
            <h3 className="font-display font-bold text-xl text-light-text flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sports-green shadow-sm shadow-sports-green/50"></span>
              Booking Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-xl border border-light-600 space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-3 text-sports-orange" />
                <span className="text-sm">{format(date, 'EEEE, MMMM do, yyyy')}</span>
              </div>
              <div className="flex items-start text-gray-700">
                <Clock className="w-4 h-4 mr-3 text-sports-yellow mt-0.5" />
                <div className="text-sm font-medium flex flex-col gap-1">
                  {selectedSlots.map(slot => (
                    <span key={slot.id}>{slot.startTime} - {slot.endTime}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center pt-2 border-t border-light-600 mt-2">
                <CreditCard className="w-4 h-4 mr-3 text-sports-green" />
                <span className="text-sm font-bold text-sports-green">₹{totalAmount}</span>
                <span className="text-xs text-gray-500 ml-2">(Amount to pay)</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-white border border-light-600 rounded-lg py-2.5 text-light-text placeholder-gray-400 focus:ring-1 focus:ring-sports-green focus:border-sports-green transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-white border border-light-600 rounded-lg py-2.5 text-light-text placeholder-gray-400 focus:ring-1 focus:ring-sports-green focus:border-sports-green transition-colors"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Number of Players</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="playersCount"
                    required
                    min="2"
                    max="30"
                    value={formData.playersCount}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-white border border-light-600 rounded-lg py-2.5 text-light-text placeholder-gray-400 focus:ring-1 focus:ring-sports-green focus:border-sports-green transition-colors"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth className="bg-sports-green hover:bg-sports-green/90 text-white mt-6">
              Continue to Payment
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
