import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!resetToken) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/auth/reset-password', { 
        resetToken, 
        newPassword,
        confirmPassword 
      });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to reset password';
      const details = error.response?.data?.details;
      
      if (details && Array.isArray(details)) {
        details.forEach(detail => toast.error(detail));
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-white/70 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2 gradient-text">
          Reset Password
        </h1>
        <p className="text-white/70 text-center mb-8">
          Create a new strong password
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-primary placeholder-white/50"
              required
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <div>
            <label className="block text-white mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-primary placeholder-white/50"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-green-400 text-sm mt-2">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
