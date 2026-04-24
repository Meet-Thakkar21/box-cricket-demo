import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store
let sports = [
  { id: 'sport-cricket', name: 'Box Cricket' },
  { id: 'sport-pickleball', name: 'Pickleball' }
];

let slots = [];

const generateSlotsForSport = (sportId) => {
  for (let i = 0; i < 24; i++) {
    const id = `slot-${sportId}-${i}`;
    const startTime = `${i.toString().padStart(2, '0')}:00`;
    const endTime = `${(i + 1).toString().padStart(2, '0')}:00`;
    
    let price = 1000;
    if (i >= 18) price = 1500;
    else if (i >= 16) price = 1200;

    slots.push({
      id,
      sportId,
      startTime,
      endTime,
      price,
      isAvailable: true,
    });
  }
};

// Generate default slots for default sports
sports.forEach(s => generateSlotsForSport(s.id));

let bookings = [];
let slotOverrides = {}; // Structure: { "YYYY-MM-DD": { "slot-id": { price, isAvailable } } }

// Get all sports
app.get('/api/sports', (req, res) => {
  res.json(sports);
});

// Create a sport
app.post('/api/sports', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  const newSport = {
    id: `sport-${Date.now()}`,
    name
  };
  sports.push(newSport);
  generateSlotsForSport(newSport.id);
  
  res.status(201).json(newSport);
});

// Get all base slots or merged slots for a specific date (and optional sportId)
app.get('/api/slots', (req, res) => {
  const { date, sportId } = req.query;
  
  let targetSlots = slots;
  if (sportId) {
    targetSlots = targetSlots.filter(s => s.sportId === sportId);
  }

  if (!date || !slotOverrides[date]) {
    return res.json(targetSlots);
  }

  // Merge base slots with date-specific overrides
  const overridesForDate = slotOverrides[date];
  const mergedSlots = targetSlots.map(s => {
    const override = overridesForDate[s.id];
    if (override) {
      return { 
        ...s, 
        price: override.price !== undefined ? override.price : s.price,
        isAvailable: override.isAvailable !== undefined ? override.isAvailable : s.isAvailable
      };
    }
    return s;
  });

  res.json(mergedSlots);
});

// Update slot price or availability (Base Settings)
app.put('/api/slots/:id', (req, res) => {
  const { id } = req.params;
  const { price, isAvailable } = req.body;
  
  slots = slots.map(s => {
    if (s.id === id) {
      return {
        ...s,
        price: price !== undefined ? price : s.price,
        isAvailable: isAvailable !== undefined ? isAvailable : s.isAvailable
      };
    }
    return s;
  });
  
  res.json(slots.find(s => s.id === id));
});

// Create or update a date-specific slot override
app.put('/api/slots/:id/override', (req, res) => {
  const { id } = req.params;
  const { date, price, isAvailable } = req.body;
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required for a slot override.' });
  }

  if (!slotOverrides[date]) {
    slotOverrides[date] = {};
  }

  const existingOverride = slotOverrides[date][id] || {};
  
  slotOverrides[date][id] = {
    ...existingOverride,
    price: price !== undefined ? price : existingOverride.price,
    isAvailable: isAvailable !== undefined ? isAvailable : existingOverride.isAvailable
  };
 
  res.json(slotOverrides[date][id]);
});

// Get bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  
  // bookingData.slotIds is an array of strings
  const slotIds = bookingData.slotIds;
  
  // Check if any slot is already booked for this date
  const isAlreadyBooked = bookings.some(
    b => b.date === bookingData.date && b.status !== 'rejected' && b.slotIds.some(id => slotIds.includes(id))
  );

  if (isAlreadyBooked) {
    return res.status(400).json({ error: 'One or more slots are already booked for this date.' });
  }

  const newBooking = {
    ...bookingData,
    id: `b-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Clear all bookings (for admin testing purposes)
app.delete('/api/bookings', (req, res) => {
  bookings = [];
  res.json({ success: true });
});

// Cancel a specific booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== id);
  if (bookings.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Update booking status (approve/reject)
app.put('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  let updatedBooking = null;
  bookings = bookings.map(b => {
    if (b.id === id) {
      updatedBooking = { ...b, status };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    res.json(updatedBooking);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Delete a base slot
app.delete('/api/slots/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = slots.length;
  slots = slots.filter(s => s.id !== id);
  
  if (slots.length < initialLength) {
    // Optionally clean up overrides related to this slot
    for (const date in slotOverrides) {
      if (slotOverrides[date][id]) {
        delete slotOverrides[date][id];
      }
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Slot not found' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
