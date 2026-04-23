import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Trophy, CalendarDays, LayoutDashboard, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/', icon: <Trophy className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <Users className="w-4 h-4" /> },
    { name: 'Book Now', path: '/book', icon: <CalendarDays className="w-4 h-4" /> },
    { name: 'Admin', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-light-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sports-green/10 flex items-center justify-center border border-sports-green/30">
              <Trophy className="w-5 h-5 text-sports-green" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-light-text">
              BOX<span className="text-sports-green">CRICKET</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 h-full">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative flex items-center space-x-2 text-sm font-bold transition-colors h-full",
                  location.pathname === link.path 
                    ? "text-sports-green" 
                    : "text-light-muted hover:text-sports-green"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-sports-green rounded-t-md"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-light-muted hover:text-light-text focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-light-600 animate-in slide-in-from-top-2 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-md text-base font-bold transition-colors",
                  location.pathname === link.path
                    ? "bg-sports-green/10 text-sports-green"
                    : "text-light-muted hover:bg-gray-50 hover:text-sports-green"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
