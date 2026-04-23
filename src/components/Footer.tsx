import { Trophy, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-card rounded-none border-x-0 border-b-0 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Trophy className="w-6 h-6 text-neon-blue" />
            <span className="font-display font-bold text-lg text-white">
              NEON<span className="text-neon-blue">CRICKET</span>
            </span>
          </div>
          
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Neon Cricket Arena. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
