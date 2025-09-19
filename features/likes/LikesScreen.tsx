import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';
import { supabase } from '../../services/supabaseClient';
import GlassCard from '../../components/GlassCard';
import HobbyPill from '../../components/HobbyPill';
import Button from '../../components/Button';
import { CheckBadgeIcon, HeartIcon, XMarkIcon } from '../../components/icons/Icons';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from '../discover/UserCard';

const LikeUserCard: React.FC<{ 
  user: User; 
  onLikeBack: (id: string) => void; 
  onPass: (id: string) => void;
  onViewProfile: (user: User) => void;
}> = ({ user, onLikeBack, onPass, onViewProfile }) => (
  <button onClick={() => onViewProfile(user)} className="text-left h-full w-full">
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
        <Button onClick={(e) => { e.stopPropagation(); onPass(user.id); }} variant="secondary" className="!bg-gray-500/20 hover:!bg-gray-500/40">
            <XMarkIcon className="w-6 h-6 mx-auto"/>
        </Button>
        <Button onClick={(e) => { e.stopPropagation(); onLikeBack(user.id); }} className="!bg-green-500/80 hover:!bg-green-500/100">
          <HeartIcon className="w-6 h-6 mx-auto"/>
        </Button>
      </div>
    </GlassCard>
  </button>
);

const LikesScreen: React.FC = () => {
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const loadLikes = async () => {
      if (!loggedInUser) return;
      setLoading(true);
      
      // Fetch IDs of users who liked the current user
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('user_id')
        .eq('liked_user_id', loggedInUser.id)
        .eq('did_like', true);

      if (likesError) {
        console.error("Error fetching likes:", likesError);
        setLoading(false);
        return;
      }

      if (likes.length === 0) {
        setLikedUsers([]);
        setLoading(false);
        return;
      }
      
      const userIds = likes.map(like => like.user_id);

      // Fetch the full profiles of those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) {
        console.error("Error fetching liked profiles:", profilesError);
      } else {
        setLikedUsers(profiles as User[]);
      }

      setLoading(false);
    };

    if(loggedInUser) {
      loadLikes();
    }
  }, [loggedInUser]);

  const handleViewProfile = (user: User) => {
    setViewingUser(user);
  };
  
  const handleCloseProfile = () => {
    setViewingUser(null);
  };

  const handleAction = (userId: string) => {
    setLikedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    handleCloseProfile();
  };
  
  const handleLikeBack = async (likedBackUserId: string) => {
    if (!loggedInUser) return;
    console.log(`Matched with user ${likedBackUserId}!`);
    // This could create a 'matches' record in the database
    const { error } = await supabase.from('matches').insert({
      user1_id: loggedInUser.id,
      user2_id: likedBackUserId
    });
    if (error) console.error("Error creating match", error);
    
    handleAction(likedBackUserId);
  };
  
  const handlePass = (userId: string) => {
    console.log(`Passed on user ${userId}.`);
    // Optionally update the 'likes' record to show it was seen/passed
    handleAction(userId);
  };

  return (
    <>
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
                onViewProfile={handleViewProfile}
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

      <AnimatePresence>
        {viewingUser && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseProfile}
          >
            <motion.div
              className="w-full max-w-sm h-full max-h-[85vh] flex flex-col gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-grow overflow-y-auto min-h-0">
                <UserCard 
                  user={viewingUser}
                  loggedInUser={loggedInUser}
                />
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                <Button onClick={() => handlePass(viewingUser.id)} variant="secondary" className="!rounded-xl !py-3">
                    <XMarkIcon className="w-7 h-7 text-red-500 mx-auto" />
                </Button>
                <Button onClick={() => handleLikeBack(viewingUser.id)} variant="secondary" className="!bg-green-500/20 hover:!bg-green-500/30 !rounded-xl !py-3">
                    <HeartIcon className="w-7 h-7 text-green-500 mx-auto" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LikesScreen;
