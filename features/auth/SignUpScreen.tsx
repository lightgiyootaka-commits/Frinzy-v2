import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useProgress } from '../../contexts/ProgressContext';
import { useCelebration } from '../../contexts/CelebrationContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const { fireCheckpoint } = useCelebration();
  const { updateOnboardingData } = useOnboarding();

  useEffect(() => {
    setProgress(20);
  }, [setProgress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // This can be used by a trigger to populate the profile
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      // It's recommended to set up a DB trigger in Supabase to auto-create a profile.
      // The user is signed in automatically after this.
      updateOnboardingData({ name, email, password });
      fireCheckpoint();
      setTimeout(() => {
        navigate('/create-profile');
      }, 600);
    } else {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
    }
  };

  return (
    <GlassCard className="w-full">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Join Frinzy</h1>
      <p className="text-center text-indigo-200 mb-6">Connect based on who you are, not what you look like.</p>
      {error && <p className="text-center text-red-300 bg-red-500/30 p-2 rounded-md mb-4">{error}</p>}
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
            minLength={6}
          />
        </div>
        <Button type="submit" size="lg" className="w-full !mt-6" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-center text-indigo-200 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-white hover:underline">
          Log In
        </Link>
      </p>
    </GlassCard>
  );
};

export default SignUpScreen;
