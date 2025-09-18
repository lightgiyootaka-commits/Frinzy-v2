
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials against Firebase
    console.log('Logging in with:', { email, password });
    login();
    navigate('/discover');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back!</h1>
        <p className="text-center text-indigo-200 mb-6">Log in to find your vibe.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-100 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-indigo-100 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full !mt-6">
            Log In
          </Button>
        </form>
        <p className="text-center text-indigo-200 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default LoginScreen;
