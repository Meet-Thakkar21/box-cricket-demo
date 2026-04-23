import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-sports-green selection:text-dark-900 overflow-x-hidden">
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Routes with Navbar & Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/book" element={<Booking />} />
                    <Route path="/payment" element={<Payment />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
        <Toaster position="top-center" />
      </Router>
    </AppProvider>
  );
}

export default App;
