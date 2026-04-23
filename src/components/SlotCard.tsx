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
        "relative p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 border",
        isAvailable 
          ? isSelected
            ? "bg-neon-blue/20 border-neon-blue shadow-neon-blue"
            : "bg-dark-800/80 border-neon-green/30 hover:border-neon-green shadow-[0_0_15px_rgba(0,255,102,0.1)] hover:shadow-neon-green"
          : "bg-dark-900/50 border-red-500/20 opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "absolute top-2 right-2 w-2 h-2 rounded-full",
        isAvailable ? "bg-neon-green shadow-[0_0_5px_#00ff66]" : "bg-red-500"
      )} />
      
      <Clock className={cn("w-6 h-6", isAvailable ? "text-neon-blue" : "text-gray-500")} />
      
      <div className="text-center">
        <p className="font-display font-bold text-lg text-white">
          {slot.startTime} - {slot.endTime}
        </p>
        <p className={cn("text-sm font-medium mt-1", isAvailable ? "text-neon-green" : "text-red-400")}>
          ₹{slot.price}
        </p>
      </div>

      {!isAvailable && (
        <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
          <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded border border-red-500/50 transform -rotate-12">
            BOOKED
          </span>
        </div>
      )}
    </motion.div>
  );
};
