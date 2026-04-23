import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking, sports } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingState = location.state;

  if (!bookingState || !bookingState.bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-900 px-4">
        <div className="text-center glass-card p-10 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-light-text mb-2">Invalid Session</h2>
          <p className="text-light-muted mb-6">No booking data found. Please restart your booking.</p>
          <Button onClick={() => navigate('/book')} fullWidth>Go to Booking</Button>
        </div>
      </div>
    );
  }

  const { bookingData, selectedSlots } = bookingState;
  const sportName = sports.find(s => s.id === bookingData.sportId)?.name || 'Unknown Sport';

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    try {
      // Add 'completed' status
      const finalBookingData = {
        ...bookingData,
        paymentStatus: 'completed' as const
      };

      await addBooking(finalBookingData);
      
      toast.success('Payment Successful! Slot Booked.', {
        style: {
          background: '#ffffff',
          color: '#15803d',
          border: '1px solid #22c55e',
        },
      });
      window.scrollTo(0, 0);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Payment failed', {
        style: {
          background: '#ffffff',
          color: '#ef4444',
          border: '1px solid #ef4444',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-light-900 relative z-10 flex items-center justify-center">
      {/* Background Image Elements */}
      <div className="absolute inset-0 z-0 bg-white fixed">
        <img 
          src="/turf2.webp" 
          alt="Cricket Turf Background" 
          className="w-full h-full object-cover opacity-[0.15]" 
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="glass-card max-w-lg w-full overflow-hidden flex flex-col md:flex-row shadow-lg relative z-10">
        {/* Left Side - Details */}
        <div className="bg-gray-50 p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-light-600 flex flex-col justify-center">
          <h2 className="text-2xl font-display font-bold text-light-text mb-6">Payment Details</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-light-muted uppercase font-bold tracking-wider mb-1">Sport</p>
              <p className="text-light-text font-bold text-sports-green">{sportName}</p>
            </div>
            <div>
              <p className="text-xs text-light-muted uppercase font-bold tracking-wider mb-1">Name</p>
              <p className="text-light-text font-medium">{bookingData.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-light-muted uppercase font-bold tracking-wider mb-1">Date</p>
              <p className="text-light-text font-medium">{bookingData.date}</p>
            </div>
            <div>
              <p className="text-xs text-light-muted uppercase font-bold tracking-wider mb-1">Slots</p>
              <div className="flex flex-col">
                {selectedSlots.map((s: any) => (
                  <span key={s.id} className="text-light-text font-medium text-sm">
                    {s.startTime} - {s.endTime}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-light-600">
            <p className="text-sm text-light-muted mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-sports-green">₹{bookingData.amount}</p>
          </div>
        </div>

        {/* Right Side - QR Code */}
        <div className="p-8 md:w-1/2 bg-white flex flex-col items-center justify-center text-center">
          <p className="text-light-text font-medium mb-6">Scan QR to Pay</p>
          
          <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 mb-8 p-4">
            <QrCode className="w-full h-full text-gray-400" strokeWidth={1} />
          </div>

          <Button 
            onClick={handlePaymentConfirm} 
            isLoading={isProcessing}
            className="w-full bg-sports-green hover:bg-sports-green/90 text-white font-bold py-3 shadow-md"
          >
            Simulate Payment Done
          </Button>
          
          <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Secure Transaction
          </p>
        </div>
      </div>
    </div>
  );
};
