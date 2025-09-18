
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new user in Firebase Auth & Firestore
    console.log('Signing up with:', { name, email, password });
    // After successful signup, redirect to the profile creation screen
    navigate('/create-profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Join Frinzy</h1>
        <p className="text-center text-indigo-200 mb-6">Connect based on who you are, not what you look like.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-100 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Your Name"
              required
            />
          </div>
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
            Create Account
          </Button>
        </form>
        <p className="text-center text-indigo-200 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-white hover:underline">
            Log In
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default SignUpScreen;
