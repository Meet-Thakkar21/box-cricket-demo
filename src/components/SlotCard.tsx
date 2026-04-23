import React from 'react';
import { Slot } from '../types';
import { cn } from '../utils/cn';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SlotCardProps {
  slot: Slot;
  isSelected?: boolean;
  onSelect?: (slot: Slot) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, isSelected, onSelect }) => {
  const isAvailable = slot.isAvailable;

  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.05 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      onClick={() => isAvailable && onSelect?.(slot)}
      className={cn(
        "relative p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 border bg-white",
        isAvailable 
          ? isSelected
            ? "border-sports-green bg-sports-green/10 shadow-sm shadow-sports-green/20"
            : "border-light-600 hover:border-sports-green shadow-sm hover:shadow-md"
          : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "absolute top-2 right-2 w-2 h-2 rounded-full",
        isAvailable ? "bg-sports-green" : "bg-red-500"
      )} />
      
      <Clock className={cn("w-6 h-6", isAvailable ? "text-sports-green" : "text-gray-400")} />
      
      <div className="text-center">
        <p className="font-display font-bold text-lg text-light-text">
          {slot.startTime} - {slot.endTime}
        </p>
        <p className={cn("text-sm font-bold mt-1", isAvailable ? "text-sports-green" : "text-red-500")}>
          ₹{slot.price}
        </p>
      </div>

      {!isAvailable && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded border border-red-600 transform -rotate-12 shadow-sm">
            BOOKED
          </span>
        </div>
      )}
    </motion.div>
  );
};
