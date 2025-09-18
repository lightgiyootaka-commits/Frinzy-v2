import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { fetchDiscoverUsers } from '../../services/mockApi';
import GlassCard from '../../components/GlassCard';
import HobbyPill from '../../components/HobbyPill';
import Button from '../../components/Button';
import { CheckBadgeIcon, HeartIcon, XMarkIcon } from '../../components/icons/Icons';
import { useAuth } from '../../contexts/AuthContext';

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <GlassCard className="h-full flex flex-col">
      <div className="relative">
        <img src={user.avatarUrl} alt={user.name} className="w-full h-80 object-cover rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-white">{user.name}, {user.age}</h2>
            {user.isVerified && <CheckBadgeIcon className="w-7 h-7 text-white" />}
          </div>
          <p className="text-lg text-gray-300">{user.city}</p>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <p className="text-xl font-semibold text-primary dark:text-purple-300 mb-4">{user.personalityType}</p>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{user.bio}</p>
        
        <div>
          <h3 className="font-bold text-lg mb-2">Hobbies</h3>
          <div className="flex flex-wrap">
            {user.hobbies.map(hobby => <HobbyPill key={hobby.id} hobby={hobby} />)}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};


const DiscoverScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      if (!loggedInUser) return;

      setLoading(true);
      const allUsers = await fetchDiscoverUsers();
      
      const filteredUsers = allUsers.filter(user => {
        // Condition 1: Same city
        const sameCity = user.city === loggedInUser.city;

        // Condition 2: At least one common hobby
        const hasCommonHobby = user.hobbies.some(userHobby => 
            loggedInUser.hobbies.some(loggedInUserHobby => loggedInUserHobby.id === userHobby.id)
        );

        return sameCity && hasCommonHobby;
      });

      setUsers(filteredUsers);
      setCurrentUserIndex(0);
      setLoading(false);
    };
    loadUsers();
  }, [loggedInUser]);
  
  const handleNextUser = () => {
      setCurrentUserIndex(prevIndex => (prevIndex + 1));
  };

  const handleLike = () => {
    if (currentUserIndex < users.length) {
      console.log(`Liked user: ${users[currentUserIndex].id}`);
      handleNextUser();
    }
  };

  const handlePass = () => {
     if (currentUserIndex < users.length) {
      console.log(`Passed user: ${users[currentUserIndex].id}`);
      handleNextUser();
    }
  };

  const currentUser = users[currentUserIndex];

  if (loading) {
    return <div className="text-center p-10">Finding people...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      {currentUser ? (
        <>
          <UserCard user={currentUser} />
          <div className="flex justify-center gap-6 mt-6">
            <Button onClick={handlePass} variant="secondary" className="!rounded-full !p-4 !bg-red-500/20 hover:!bg-red-500/40">
              <XMarkIcon className="w-8 h-8 text-red-500"/>
            </Button>
            <Button onClick={handleLike} variant="secondary" className="!rounded-full !p-4 !bg-green-500/20 hover:!bg-green-500/40">
              <HeartIcon className="w-8 h-8 text-green-500" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 max-w-lg mx-auto">
          {currentUserIndex === 0 && users.length === 0 ? (
            <>
              <h2 className="text-2xl font-semibold">No Potential Friends Found</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Looks like there's no one in your city who shares your hobbies right now.
                  <br />
                  Try adding more hobbies to your profile to see more people!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">That's everyone for now!</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for new people.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverScreen;