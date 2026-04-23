import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        loginAdmin();
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Use admin / admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-light-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sports-green/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 border-light-600 shadow-lg bg-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-light-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-sports-green" />
            </div>
            <h2 className="text-3xl font-display font-bold text-light-text">Admin Portal</h2>
            <p className="text-light-muted mt-2">Sign in to manage bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-light-muted mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 bg-gray-50 border border-light-600 rounded-lg py-3 text-light-text placeholder-gray-400 focus:ring-1 focus:ring-sports-green focus:border-sports-green transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-muted mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-gray-50 border border-light-600 rounded-lg py-3 text-light-text placeholder-gray-400 focus:ring-1 focus:ring-sports-green focus:border-sports-green transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-sports-green hover:bg-sports-green/90 text-white font-bold"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>

            <p className="text-center text-xs text-light-muted mt-4">
              Demo credentials: admin / admin123
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
