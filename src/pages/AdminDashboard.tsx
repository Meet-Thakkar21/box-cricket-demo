import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, IndianRupee, LogOut, Save, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Slot } from '../types';

export const AdminDashboard = () => {
  const { sports, addSport, isAdmin, logoutAdmin, bookings, slots, updateSlotPrice, toggleSlotAvailability, updateSlotOverride, fetchSlotsForDate, fetchData, isLoading, deleteSlot, cancelBooking, updateBookingStatus } = useAppContext();
  
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSportId, setSelectedSportId] = useState<string>('');
  const [displayedSlots, setDisplayedSlots] = useState<Slot[]>([]);
  const [newSportName, setNewSportName] = useState('');
  const [reviewingBooking, setReviewingBooking] = useState<any | null>(null);

  const [confirmAction, setConfirmAction] = useState<{type: 'delete_slot' | 'cancel_booking', id: string, message: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (sports.length > 0 && !selectedSportId) {
      setSelectedSportId(sports[0].id);
    }
  }, [sports]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedSportId) return;
      if (!selectedDate) {
        setDisplayedSlots(slots.filter(s => s.sportId === selectedSportId));
      } else {
        const dateSlots = await fetchSlotsForDate(selectedDate, selectedSportId);
        setDisplayedSlots(dateSlots);
      }
    };
    loadSlots();
  }, [selectedDate, slots, bookings, selectedSportId]);

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Calculate stats
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const totalRevenue = approvedBookings.reduce((sum, b) => sum + b.amount, 0);
  const totalBookings = approvedBookings.length;

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSportName.trim()) return;
    const success = await addSport(newSportName);
    if (success) {
      setNewSportName('');
    }
  };

  const handleEditSlot = (slot: Slot) => {
    setEditingSlotId(slot.id);
    setEditPrice(slot.price);
  };

  const handleSaveSlot = async (slotId: string) => {
    if (selectedDate) {
      await updateSlotOverride(selectedDate, slotId, { price: editPrice });
      const dateSlots = await fetchSlotsForDate(selectedDate);
      setDisplayedSlots(dateSlots);
    } else {
      await updateSlotPrice(slotId, editPrice);
    }
    setEditingSlotId(null);
  };

  const handleToggleAvailability = async (slotId: string) => {
    const slot = displayedSlots.find(s => s.id === slotId);
    if (!slot) return;

    if (selectedDate) {
      await updateSlotOverride(selectedDate, slotId, { isAvailable: !slot.isAvailable });
      const dateSlots = await fetchSlotsForDate(selectedDate);
      setDisplayedSlots(dateSlots);
    } else {
      await toggleSlotAvailability(slotId);
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'delete_slot') {
      await deleteSlot(confirmAction.id);
      setDisplayedSlots(prev => prev.filter(s => s.id !== confirmAction.id));
    } else if (confirmAction.type === 'cancel_booking') {
      await cancelBooking(confirmAction.id);
    }
    setConfirmAction(null);
  };

  const handleDeleteSlot = (slotId: string) => {
    setConfirmAction({
      type: 'delete_slot',
      id: slotId,
      message: 'Are you sure you want to delete this slot permanently? This action cannot be undone.'
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    setConfirmAction({
      type: 'cancel_booking',
      id: bookingId,
      message: 'Are you sure you want to cancel this customer booking? The slots will immediately become available.'
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-light-900">Loading admin data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-900 relative">
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-light-text mb-2">Confirm Action</h3>
            <p className="text-light-muted mb-6">{confirmAction.message}</p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-light-muted hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Go Back
              </button>
              <button 
                onClick={executeConfirmAction}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-light-text mb-4">Review Booking Request</h3>
            
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Customer Name</span>
                <span className="font-bold text-gray-800">{reviewingBooking.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Phone Number</span>
                <span className="font-bold text-gray-800">{reviewingBooking.phoneNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Players Count</span>
                <span className="font-bold text-gray-800">{reviewingBooking.playersCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Date & Sport</span>
                <span className="font-bold text-gray-800">
                  {format(new Date(reviewingBooking.date), 'MMM dd, yyyy')} • {sports.find(s => s.id === reviewingBooking.sportId)?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Time Slots</span>
                <span className="font-bold text-gray-800">
                  {reviewingBooking.slotIds.map((id: string) => {
                    const slot = slots.find(s => s.id === id);
                    return slot ? `${slot.startTime}-${slot.endTime}` : id;
                  }).join(', ')}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Amount</span>
                <span className="font-bold text-gray-800">₹{reviewingBooking.amount}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Payment Status</span>
                <span className={`font-bold uppercase ${reviewingBooking.paymentStatus === 'completed' ? 'text-green-600' : 'text-red-500'}`}>
                  {reviewingBooking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setReviewingBooking(null)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-bold"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  updateBookingStatus(reviewingBooking.id, 'rejected');
                  setReviewingBooking(null);
                }}
                className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-lg transition-colors font-bold"
              >
                Reject
              </button>
              <button 
                onClick={() => {
                  updateBookingStatus(reviewingBooking.id, 'approved');
                  setReviewingBooking(null);
                }}
                className="flex-1 px-4 py-2 bg-sports-green hover:bg-green-700 text-white rounded-lg transition-colors font-bold shadow-md"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-light-600 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-light-text">Admin Dashboard</h1>
          <p className="text-sm text-light-muted">Box Cricket Management</p>
        </div>
        <button 
          onClick={logoutAdmin}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm border border-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-sports-green">
            <div>
              <p className="text-light-muted text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-light-text">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-4 rounded-full bg-sports-green/10">
              <IndianRupee className="w-8 h-8 text-sports-green" />
            </div>
          </div>
          <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-sports-orange">
            <div>
              <p className="text-light-muted text-sm font-bold uppercase tracking-wider mb-1">Total Bookings</p>
              <h3 className="text-3xl font-bold text-light-text">{totalBookings}</h3>
            </div>
            <div className="p-4 rounded-full bg-sports-orange/10">
              <Users className="w-8 h-8 text-sports-orange" />
            </div>
          </div>
        </section>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Sport Section */}
          <section className="lg:col-span-3 glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-light-text mb-1">Manage Sports</h3>
              <p className="text-sm text-light-muted">Create new sports or grounds. 24-hour slots are generated automatically.</p>
            </div>
            <form onSubmit={handleAddSport} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                value={newSportName}
                onChange={(e) => setNewSportName(e.target.value)}
                placeholder="e.g., Football Turf"
                className="flex-1 sm:w-64 border border-light-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sports-green focus:border-sports-green bg-white text-light-text"
              />
              <button 
                type="submit"
                disabled={!newSportName.trim()}
                className="w-full sm:w-auto bg-sports-green hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              >
                Add Sport
              </button>
            </form>
          </section>

          {/* Slot Management */}
          <section className="lg:col-span-1 glass-card overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-light-600 bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-light-text">Manage Slots</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${selectedDate ? 'bg-sports-green/20 text-sports-green' : 'bg-gray-200 text-light-muted'}`}>
                  {selectedDate ? 'Date Override' : 'Base Settings'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedSportId}
                  onChange={(e) => setSelectedSportId(e.target.value)}
                  className="w-full border border-light-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sports-green focus:border-sports-green bg-white text-light-text font-medium"
                >
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>{sport.name}</option>
                  ))}
                </select>
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full border border-light-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sports-green focus:border-sports-green text-light-text bg-white"
              />
            </div>
            <div className="overflow-y-auto p-4 flex-1 space-y-3">
              {displayedSlots.map(slot => (
                <div key={slot.id} className="border border-light-600 rounded-lg p-3 hover:border-sports-green transition-colors bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-light-text">{slot.startTime} - {slot.endTime}</span>
                    {slot.isBooked ? (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${slot.bookingStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {slot.bookingStatus === 'pending' ? 'Waiting for Review' : 'Booked'}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleToggleAvailability(slot.id)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${slot.isAvailable ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                      >
                        {slot.isAvailable ? 'Active' : 'Disabled'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    {editingSlotId === slot.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-gray-500 font-bold">₹</span>
                        <input 
                          type="number" 
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 border border-light-600 rounded px-2 py-1 text-sm text-light-text bg-white focus:outline-none focus:ring-1 focus:ring-sports-green focus:border-sports-green"
                        />
                        <button onClick={() => handleSaveSlot(slot.id)} className="ml-auto text-sports-green hover:bg-green-50 p-1 rounded">
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`font-bold text-sm ${slot.isBooked ? 'text-gray-400' : 'text-sports-green'}`}>₹{slot.price}</span>
                        {!slot.isBooked && (
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEditSlot(slot)} className="text-gray-400 hover:text-sports-green" title="Edit Price">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteSlot(slot.id)} className="text-gray-400 hover:text-red-500" title="Delete Slot">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bookings Table */}
          <section className="lg:col-span-2 glass-card overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-light-600 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-light-text">Recent Bookings</h3>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-sm text-light-text">
                <thead className="bg-gray-50 text-xs uppercase text-light-muted sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold border-b border-light-600">Customer</th>
                    <th className="px-6 py-4 font-bold border-b border-light-600">Date & Slots</th>
                    <th className="px-6 py-4 font-bold border-b border-light-600 text-right">Amount</th>
                    <th className="px-6 py-4 font-bold border-b border-light-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-600 bg-white">
                  {bookings.length > 0 ? (
                    bookings.slice().reverse().map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-light-text">{booking.customerName}</div>
                          <div className="text-xs text-light-muted mt-1">{booking.phoneNumber} • {booking.playersCount || 'N/A'} players</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-sports-green font-bold mt-1">
                            {sports.find(s => s.id === booking.sportId)?.name || 'Unknown Sport'} • {booking.slotIds.length} slot(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-bold text-light-text">₹{booking.amount}</div>
                          <div className={`text-[10px] uppercase font-bold mt-1 ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{booking.status}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {booking.status === 'pending' ? (
                            <button 
                              onClick={() => setReviewingBooking(booking)}
                              className="text-xs text-sports-green hover:text-green-800 font-bold px-3 py-1 border border-green-200 rounded-md bg-green-50 hover:bg-green-100 transition-colors shadow-sm"
                            >
                              Review & Approve
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-xs text-gray-500 hover:text-red-700 font-bold px-3 py-1 border border-gray-200 rounded-md bg-gray-50 hover:bg-red-100 hover:border-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-light-muted">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
