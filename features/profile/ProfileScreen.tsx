import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { generateAvatar } from '../../services/geminiService';
import GlassCard from '../../components/GlassCard';
import HobbyPill from '../../components/HobbyPill';
import Button from '../../components/Button';
import { PencilIcon, CheckBadgeIcon, ArrowPathIcon } from '../../components/icons/Icons';
import { HOBBIES, CITIES, GENDERS } from '../../constants';
import { Hobby, City, Gender } from '../../types';

const ProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // State for editable fields
  const [editedName, setEditedName] = useState('');
  const [editedAge, setEditedAge] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedHobbies, setEditedHobbies] = useState<Hobby[]>([]);
  const [editedCity, setEditedCity] = useState<City>(City.Bangalore);
  const [editedGender, setEditedGender] = useState<Gender>(Gender.PreferNotToSay);
  const [customHobby, setCustomHobby] = useState('');

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedAge(user.age.toString());
      setEditedBio(user.bio);
      setEditedHobbies(user.hobbies);
      setEditedCity(user.city);
      setEditedGender(user.gender);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center p-10">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  const resetFields = () => {
      setEditedName(user.name);
      setEditedAge(user.age.toString());
      setEditedBio(user.bio);
      setEditedHobbies(user.hobbies);
      setEditedCity(user.city);
      setEditedGender(user.gender);
  }

  const handleEdit = () => {
    resetFields();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedProfileData = {
      name: editedName,
      age: Number(editedAge),
      bio: editedBio,
      hobbies: editedHobbies,
      city: editedCity,
      gender: editedGender
    };
    updateUser(updatedProfileData);
    setIsEditing(false);
  };

  const handleHobbyToggle = (hobby: Hobby) => {
    setEditedHobbies(prev =>
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
      if (!editedHobbies.some(h => h.name.toLowerCase() === newHobby.name.toLowerCase())) {
        setEditedHobbies(prev => [...prev, newHobby]);
      }
      setCustomHobby('');
    }
  };
  
  const handleRegenerateAvatar = async () => {
    if (!user) return;
    setIsGeneratingAvatar(true);
    try {
        const hobbiesForAvatar = isEditing ? editedHobbies : user.hobbies;
        const newAvatarUrl = await generateAvatar(hobbiesForAvatar);
        updateUser({ avatarUrl: newAvatarUrl });
    } catch (error) {
        console.error("Failed to regenerate avatar", error);
        // Here you might want to show an error toast to the user
    } finally {
        setIsGeneratingAvatar(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <GlassCard className="relative p-0 overflow-hidden">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="p-4 sm:p-8 pt-0 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative group flex-shrink-0">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-light-card dark:border-dark-card" 
                />
                 <button 
                  onClick={handleRegenerateAvatar}
                  disabled={isGeneratingAvatar}
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {isGeneratingAvatar ? (
                    <ArrowPathIcon className="w-8 h-8 animate-spin"/>
                  ) : (
                    <>
                      <ArrowPathIcon className="w-8 h-8"/>
                      <span className="text-xs font-bold">Regenerate</span>
                    </>
                  )}
                </button>
            </div>
            <div className="flex-grow flex flex-col sm:flex-row justify-between items-center sm:items-end w-full gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-40 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-white"
                        />
                     ) : (
                        <h1 className="text-3xl font-bold">{user.name},</h1>
                     )}
                     
                     {isEditing ? (
                        <input
                            type="number"
                            value={editedAge}
                            onChange={(e) => setEditedAge(e.target.value)}
                            className="w-20 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-white"
                        />
                     ) : (
                        <h1 className="text-3xl font-bold">{user.age}</h1>
                     )}
                    {user.isVerified && <CheckBadgeIcon className="w-7 h-7 text-secondary" />}
                  </div>
                   {isEditing ? (
                        <div className="flex gap-4 mt-2 justify-center sm:justify-start">
                             <select value={editedCity} onChange={e => setEditedCity(e.target.value as City)} className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:bg-dark-bg">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                             <select value={editedGender} onChange={e => setEditedGender(e.target.value as Gender)} className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:bg-dark-bg">
                                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                   ) : (
                       <p className="text-gray-500 dark:text-gray-400 mt-1">{user.city} &bull; {user.gender}</p>
                   )}
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">Save Changes</Button>
                        <Button onClick={handleCancel} variant="secondary" size="sm">Cancel</Button>
                    </div>
                ) : (
                    <Button onClick={handleEdit} variant="secondary" size="sm" className="flex-shrink-0">
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-primary dark:text-purple-300">{user.personalityType}</p>
                 <Button onClick={() => navigate('/quiz')} variant="secondary" size="sm">Retake Quiz</Button>
            </div>
             {isEditing ? (
                <div>
                    <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="w-full mt-2 bg-white/20 border border-white/30 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        rows={3}
                        maxLength={150}
                    />
                    <p className="text-right text-xs mt-1">{editedBio.length}/150</p>
                </div>
             ) : (
                <p className="mt-2 text-gray-600 dark:text-gray-300">{user.bio}</p>
             )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Hobbies</h2>
        {isEditing ? (
            <div>
                <div className="bg-black/10 p-3 rounded-lg flex flex-wrap gap-2 mb-4">
                    {HOBBIES.map(hobby => {
                        const isSelected = editedHobbies.some(h => h.id === hobby.id);
                        return (
                             <button type="button" key={hobby.id} onClick={() => handleHobbyToggle(hobby)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 transform active:scale-95 ${isSelected ? 'bg-primary text-white shadow-md' : 'bg-white/20 hover:bg-white/30 text-gray-800 dark:text-gray-200'}`}>
                                {hobby.name}
                            </button>
                        );
                    })}
                </div>
                 <div className="mt-3">
                     <label className="block text-sm mb-1">Can't find your hobby? Add it here:</label>
                     <div className="flex gap-2">
                        <input type="text" value={customHobby} onChange={e => setCustomHobby(e.target.value)} placeholder="e.g., Urban Exploration" className="flex-grow bg-white/20 border border-white/30 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white" />
                        <Button type="button" variant="secondary" onClick={handleAddCustomHobby}>Add</Button>
                     </div>
                </div>
                 <h3 className="text-lg font-bold mt-6 mb-2">Your Hobbies:</h3>
                 <div className="flex flex-wrap">
                    {editedHobbies.map(hobby => (
                        <HobbyPill key={hobby.id} hobby={hobby} />
                    ))}
                 </div>
            </div>
        ) : (
            <div className="flex flex-wrap">
              {user.hobbies.map(hobby => (
                <HobbyPill key={hobby.id} hobby={hobby} />
              ))}
            </div>
        )}
      </GlassCard>

      <GlassCard className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-3xl font-bold text-secondary">{user.points}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Points</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-secondary">12</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Likes Given</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-secondary">4</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-secondary">2</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Events Joined</p>
            </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfileScreen;