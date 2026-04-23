import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, Users, Phone, User } from 'lucide-react';
import { Slot } from '../types';
import { Button } from './Button';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot | null;
  date: Date;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, slot, date, onSuccess }) => {
  const { addBooking } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    playersCount: 10,
  });

  if (!isOpen || !slot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addBooking({
        date: format(date, 'yyyy-MM-dd'),
        slotId: slot.id,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        playersCount: Number(formData.playersCount),
        paymentStatus: 'completed', // Mock successful payment
        amount: slot.price,
      });
      
      toast.success('Booking confirmed successfully!', {
        style: {
          background: '#12121a',
          color: '#00ff66',
          border: '1px solid #00ff66',
        },
      });
      onSuccess();
    } catch (error) {
      toast.error('Failed to book slot. It might be already booked.', {
        style: {
          background: '#12121a',
          color: '#ff007f',
          border: '1px solid #ff007f',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-dark-800 border border-neon-blue/30 rounded-2xl shadow-neon-blue overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700 bg-dark-900/50">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_8px_#00f3ff]"></span>
              Complete Booking
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Summary */}
            <div className="bg-dark-900/80 p-4 rounded-xl border border-dark-700 space-y-3">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-3 text-neon-purple" />
                <span className="text-sm">{format(date, 'EEEE, MMMM do, yyyy')}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-3 text-neon-blue" />
                <span className="text-sm font-medium">{slot.startTime} - {slot.endTime}</span>
              </div>
              <div className="flex items-center text-gray-300 pt-2 border-t border-dark-700 mt-2">
                <CreditCard className="w-4 h-4 mr-3 text-neon-green" />
                <span className="text-sm font-bold text-neon-green">₹{slot.price}</span>
                <span className="text-xs text-gray-500 ml-2">(Amount to pay)</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-dark-900 border border-dark-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-dark-900 border border-dark-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-colors"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Number of Players</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="playersCount"
                    required
                    min="2"
                    max="30"
                    value={formData.playersCount}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-dark-900 border border-dark-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue transition-colors"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
              Pay ₹{slot.price} & Book
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
