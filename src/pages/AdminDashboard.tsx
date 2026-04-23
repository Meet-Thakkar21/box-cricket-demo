import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  IndianRupee, 
  CalendarCheck, 
  LogOut,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const { isAdmin, logoutAdmin, bookings, slots } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Calculate stats
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalBookings = bookings.length;
  const activeSlots = slots.filter(s => s.isAvailable).length;

  // Chart data (Bookings per day for the next 7 days based on data)
  // Simple grouping for mock data
  const chartData = Object.entries(
    bookings.reduce((acc, booking) => {
      acc[booking.date] = (acc[booking.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, count]) => ({
    name: format(new Date(date), 'MMM dd'),
    bookings: count
  })).slice(0, 7);

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.phoneNumber.includes(searchTerm);
    const matchesDate = dateFilter ? b.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-900 relative z-10">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-card rounded-none border-y-0 border-l-0 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold text-white">Admin Panel</h2>
          <p className="text-neon-blue text-sm">Dashboard</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
            <CalendarCheck className="w-5 h-5" />
            <span>Bookings</span>
          </a>
          {/* Add more nav items if needed */}
        </nav>

        <button 
          onClick={logoutAdmin}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 border-l-4 border-l-neon-blue">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-lg bg-neon-blue/10">
                <IndianRupee className="w-6 h-6 text-neon-blue" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 border-l-4 border-l-neon-purple">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                <h3 className="text-3xl font-bold text-white">{totalBookings}</h3>
              </div>
              <div className="p-3 rounded-lg bg-neon-purple/10">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-neon-green">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Slots</p>
                <h3 className="text-3xl font-bold text-white">{activeSlots}</h3>
              </div>
              <div className="p-3 rounded-lg bg-neon-green/10">
                <CalendarCheck className="w-6 h-6 text-neon-green" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card p-6 mb-10 h-80">
          <h3 className="text-xl font-bold text-white mb-6">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #00f3ff', borderRadius: '8px' }}
                itemStyle={{ color: '#00f3ff' }}
              />
              <Bar dataKey="bookings" fill="#00f3ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-dark-700 flex flex-col sm:flex-row justify-between gap-4">
            <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-neon-blue focus:border-neon-blue"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-neon-blue focus:border-neon-blue"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-dark-900/50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Date & Slot</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const slotInfo = slots.find(s => s.id === booking.slotId);
                    return (
                      <motion.tr 
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {booking.customerName}
                          <div className="text-xs text-gray-500 font-normal">Players: {booking.playersCount}</div>
                        </td>
                        <td className="px-6 py-4">{booking.phoneNumber}</td>
                        <td className="px-6 py-4">
                          <div className="text-white">{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-neon-blue">{slotInfo?.startTime} - {slotInfo?.endTime}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">₹{booking.amount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/20">
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
