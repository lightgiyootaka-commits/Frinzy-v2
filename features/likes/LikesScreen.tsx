import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { fetchLikes } from '../../services/mockApi';
import GlassCard from '../../components/GlassCard';
import HobbyPill from '../../components/HobbyPill';
import Button from '../../components/Button';
import { CheckBadgeIcon, HeartIcon, XMarkIcon } from '../../components/icons/Icons';

const LikeUserCard: React.FC<{ user: User; onLikeBack: (id: string) => void; onPass: (id: string) => void; }> = ({ user, onLikeBack, onPass }) => (
  <GlassCard className="flex flex-col h-full text-center">
    <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/50 object-cover" />
    <h3 className="text-xl font-bold flex items-center justify-center gap-1">
      {user.name}, {user.age}
      {user.isVerified && <CheckBadgeIcon className="w-5 h-5 text-secondary" />}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{user.city}</p>
    <p className="text-md font-semibold text-primary dark:text-purple-300 mt-1 mb-3">{user.personalityType}</p>
    
    <div className="flex-grow border-t border-white/20 pt-3">
        <h4 className="font-semibold text-sm mb-2">Hobbies</h4>
        <div className="flex flex-wrap justify-center">
          {user.hobbies.slice(0, 3).map(hobby => <HobbyPill key={hobby.id} hobby={hobby} />)}
        </div>
      </div>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <Button onClick={() => onPass(user.id)} variant="secondary" className="!bg-gray-500/20 hover:!bg-gray-500/40">
          <XMarkIcon className="w-6 h-6 mx-auto"/>
      </Button>
      <Button onClick={() => onLikeBack(user.id)} className="!bg-green-500/80 hover:!bg-green-500/100">
        <HeartIcon className="w-6 h-6 mx-auto"/>
      </Button>
    </div>
  </GlassCard>
);

const LikesScreen: React.FC = () => {
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikes = async () => {
      setLoading(true);
      const fetchedUsers = await fetchLikes();
      setLikedUsers(fetchedUsers);
      setLoading(false);
    };
    loadLikes();
  }, []);

  const handleAction = (userId: string) => {
    setLikedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  const handleLikeBack = (userId: string) => {
    console.log(`Matched with user ${userId}!`);
    // In a real app, you would create a match record and navigate to the chat.
    handleAction(userId);
  };
  
  const handlePass = (userId: string) => {
    console.log(`Passed on user ${userId}.`);
    handleAction(userId);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Who Liked You</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="animate-pulse">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
            </GlassCard>
          ))}
        </div>
      ) : likedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedUsers.map(user => 
            <LikeUserCard 
              key={user.id} 
              user={user}
              onLikeBack={handleLikeBack}
              onPass={handlePass} 
            />
          )}
        </div>
      ) : (
        <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold">No Likes Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">People who like you will show up here. <br/> Try liking more people on the Discover page!</p>
        </div>
      )}
    </div>
  );
};

export default LikesScreen;