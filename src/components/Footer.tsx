import { Trophy, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-light-600 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Trophy className="w-6 h-6 text-sports-green" />
            <span className="font-display font-bold text-lg text-light-text">
              BOX<span className="text-sports-green">CRICKET</span>
            </span>
          </div>
          
          <div className="text-sm text-light-muted mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Box Cricket Arena. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-light-muted hover:text-sports-green transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-light-muted hover:text-sports-green transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a href="#" className="text-light-muted hover:text-sports-green transition-colors">
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
