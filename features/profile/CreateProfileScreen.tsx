
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { CITIES, GENDERS, HOBBIES } from '../../constants';
import { City, Gender, Hobby } from '../../types';

const CreateProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [city, setCity] = useState<City | ''>('');
  const [selectedHobbies, setSelectedHobbies] = useState<Hobby[]>([]);
  const [customHobby, setCustomHobby] = useState('');
  const [bio, setBio] = useState('');

  const handleHobbyToggle = (hobby: Hobby) => {
    setSelectedHobbies(prev =>
      prev.some(h => h.id === hobby.id)
        ? prev.filter(h => h.id !== hobby.id)
        : [...prev, hobby]
    );
  };

  const handleAddCustomHobby = () => {
    if (customHobby.trim() !== '') {
      const newHobby: Hobby = {
        id: `custom_${Date.now()}`,
        name: customHobby.trim(),
      };
      if (!selectedHobbies.some(h => h.name.toLowerCase() === newHobby.name.toLowerCase())) {
        setSelectedHobbies(prev => [...prev, newHobby]);
      }
      setCustomHobby('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = { age: Number(age), gender, city, hobbies: selectedHobbies, bio };
    console.log('Profile Created:', profileData);
    // In a real app, you would save this data to Firestore.
    // Here we just navigate to the next step.
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <GlassCard className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Create Your Profile</h1>
        <p className="text-center text-indigo-200 mb-6">Let others know who you are. This is how you'll find your friends!</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-indigo-100 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., 18"
                  required
                  min="13"
                />
            </div>
             <div>
                <label className="block text-indigo-100 mb-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value as Gender)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:bg-dark-bg">
                    <option value="" disabled>Select...</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-indigo-100 mb-1">City</label>
                <select value={city} onChange={e => setCity(e.target.value as City)} required className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:bg-dark-bg">
                    <option value="" disabled>Select...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-indigo-100 mb-2">What are your hobbies?</label>
            <div className="bg-black/10 p-3 rounded-lg flex flex-wrap gap-2">
                {HOBBIES.map(hobby => {
                    const isSelected = selectedHobbies.some(h => h.id === hobby.id);
                    return (
                         <button type="button" key={hobby.id} onClick={() => handleHobbyToggle(hobby)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 transform active:scale-95 ${isSelected ? 'bg-primary text-white shadow-md' : 'bg-white/20 hover:bg-white/30 text-indigo-100'}`}>
                            {hobby.name}
                        </button>
                    );
                })}
            </div>
             <div className="mt-3">
                 <label className="block text-indigo-100 mb-1 text-sm">Can't find your hobby? Add it here:</label>
                 <div className="flex gap-2">
                    <input type="text" value={customHobby} onChange={e => setCustomHobby(e.target.value)} placeholder="e.g., Urban Exploration" className="flex-grow bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white" />
                    <Button type="button" variant="secondary" onClick={handleAddCustomHobby}>Add</Button>
                 </div>
            </div>
          </div>
          
          <div>
            <label className="block text-indigo-100 mb-1">Your Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Tell everyone a little bit about yourself..."
              rows={3}
              maxLength={150}
              required
            ></textarea>
            <p className="text-right text-xs text-indigo-200 mt-1">{bio.length}/150</p>
          </div>
          
          <Button type="submit" size="lg" className="w-full !mt-8">
            Continue to Quiz
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};

export default CreateProfileScreen;
