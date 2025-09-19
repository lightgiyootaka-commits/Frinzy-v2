import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from './UserCard';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { HeartIcon, XMarkIcon } from '../../components/icons/Icons';

const calculateCompatibilityScore = (user1: User, user2: User): number => {
    if (!user1 || !user2) return 0;
    let score = 0;

    const user1HobbyIds = new Set(user1.hobbies?.map(h => h.id) || []);
    const sharedHobbies = user2.hobbies?.filter(h => user1HobbyIds.has(h.id)) || [];
    score += sharedHobbies.length * 10;

    if (user1.thisOrThat && user2.thisOrThat) {
      const user1ThisOrThat = new Set(user1.thisOrThat);
      const sharedThisOrThat = user2.thisOrThat.filter(t => user1ThisOrThat.has(t));
      score += sharedThisOrThat.length * 5;
    }

    if (user1.vibeStickers && user2.vibeStickers) {
      const user1VibeStickers = new Set(user1.vibeStickers);
      const sharedVibeStickers = user2.vibeStickers.filter(s => user1VibeStickers.has(s));
      score += sharedVibeStickers.length * 3;
    }

    return score;
};


const DiscoverScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      if (!loggedInUser) return;
      
      setLoading(true);
      
      // Fetch users from the same city, excluding the logged-in user
      // NOTE: For performance on large datasets, hobby filtering should be done in a database function (RPC).
      // Here we do it client-side for simplicity.
      const { data: fetchedUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('city', loggedInUser.city)
        .neq('id', loggedInUser.id);

      if (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        return;
      }
      
      const loggedInUserHobbyIds = new Set(loggedInUser.hobbies.map(h => h.id));

      const scoredAndSortedUsers = (fetchedUsers as User[])
        .filter(user => user.hobbies.some(userHobby => loggedInUserHobbyIds.has(userHobby.id)))
        .map(user => ({
          user,
          score: calculateCompatibilityScore(loggedInUser, user),
        }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.user);
        
      setUsers(scoredAndSortedUsers);
      setCurrentIndex(0);
      setLoading(false);
    };
    
    if (loggedInUser) {
        loadUsers();
    }
  }, [loggedInUser]);

  const handleAction = async (liked: boolean) => {
    if (currentIndex >= users.length || !loggedInUser) return;

    const likedUserId = users[currentIndex].id;
    console.log(`Action: ${liked ? 'Liked' : 'Passed'} user ${likedUserId}`);
    
    // In a real app, you'd record this action in a 'likes' or 'swipes' table
    const { error } = await supabase.from('likes').insert({
      user_id: loggedInUser.id,
      liked_user_id: likedUserId,
      did_like: liked
    });

    if (error) console.error("Error recording action:", error);
    
    setCurrentIndex(prev => prev + 1);
  };

  const renderCardContent = () => {
    if (loading) {
      return (
        <GlassCard className="w-full h-full flex items-center justify-center">
          <p className="text-lg font-semibold">Finding people...</p>
        </GlassCard>
      );
    }
    
    if (currentIndex >= users.length) {
        return (
            <GlassCard className="w-full h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold">That's everyone for now!</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for new people to meet.</p>
            </GlassCard>
        );
    }
    
    return (
        <AnimatePresence>
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
            >
                <UserCard 
                  user={users[currentIndex]}
                  loggedInUser={loggedInUser}
                />
            </motion.div>
        </AnimatePresence>
    );
  };

  const showActions = !loading && currentIndex < users.length;

  return (
    <div className="flex flex-col h-full items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white md:hidden">Discover</h1>
      
      <div className="relative w-full max-w-sm flex-grow flex flex-col">
        
        <div className="flex-grow min-h-0 overflow-y-auto">
          {renderCardContent()}
        </div>

        {showActions && (
          <div className="flex-shrink-0 pt-2 bg-light-bg dark:bg-dark-bg">
            <div className="p-4 grid grid-cols-2 gap-4">
                <Button onClick={() => handleAction(false)} variant="secondary" className="!rounded-xl !py-3">
                  <XMarkIcon className="w-7 h-7 text-red-500 mx-auto" />
                </Button>
                <Button onClick={() => handleAction(true)} variant="secondary" className="!bg-green-500/20 hover:!bg-green-500/30 !rounded-xl !py-3">
                  <HeartIcon className="w-7 h-7 text-green-500 mx-auto" />
                </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
