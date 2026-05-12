import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email!');
      setSent(true);
      
      // For development - show reset token
      if (data.resetToken) {
        console.log('Reset Token:', data.resetToken);
        toast.success(`Reset token: ${data.resetToken.substring(0, 10)}...`, { duration: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2 gradient-text">
          Forgot Password?
        </h1>
        <p className="text-white/70 text-center mb-8">
          Enter your email to receive a password reset link
        </p>
        
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-primary placeholder-white/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Check Your Email</h3>
            <p className="text-white/70">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-white/60 text-sm">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-white/70 hover:text-white transition">
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
