// Fix: Creating the UserCard component to display user profiles.
import React from 'react';
import { User } from '../../types';
import GlassCard from '../../components/GlassCard';
import { CheckBadgeIcon, MapPinIcon, InformationCircleIcon, TagIcon } from '../../components/icons/Icons';
import Chip from '../../components/Chip';

interface UserCardProps {
  user: User;
  loggedInUser: User | null;
}

const UserCard: React.FC<UserCardProps> = ({ user, loggedInUser }) => {
    if (!user) return null;

    const loggedInUserHobbyIds = new Set(loggedInUser?.hobbies.map(h => h.id));
    const sharedHobbies = user.hobbies.filter(h => loggedInUserHobbyIds.has(h.id));
    const uniqueHobbies = user.hobbies.filter(h => !loggedInUserHobbyIds.has(h.id));
    
    const loggedInUserThisOrThat = new Set(loggedInUser?.thisOrThat);
    const sharedThisOrThat = user.thisOrThat.filter(t => loggedInUserThisOrThat.has(t));

    const Section: React.FC<{ title: string; icon: JSX.Element; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="mt-4 pt-4 border-t border-white/20">
            <h3 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 flex items-center mb-3">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            {children}
        </div>
    );

  return (
    <GlassCard className="w-full h-full p-0 flex flex-col overflow-hidden">
        <div className="relative">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
                    {user.isVerified && <CheckBadgeIcon className="w-7 h-7 text-secondary flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1 text-gray-300 mt-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{user.city}</span>
                </div>
            </div>
        </div>
      
        <div className="p-4 flex-grow overflow-y-auto">
            <p className="text-lg font-semibold text-primary dark:text-purple-300">{user.personalityType}</p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{user.bio}</p>
            
            {user.funLine && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
                    <p className="font-semibold text-primary dark:text-purple-300">"{user.funLine}"</p>
                </div>
            )}
            
            <Section title="Vibe Check" icon={<TagIcon className="w-4 h-4" />}>
                <div className="flex flex-wrap">
                    {[...user.thisOrThat, ...user.vibeStickers].map(item => (
                        <Chip key={item} text={item} type="vibe" isShared={sharedThisOrThat.includes(item)} />
                    ))}
                </div>
            </Section>

            <Section title="Shared Hobbies" icon={<InformationCircleIcon className="w-4 h-4" />}>
                 {sharedHobbies.length > 0 ? (
                    <div className="flex flex-wrap">
                        {sharedHobbies.map(hobby => <Chip key={hobby.id} text={hobby.name} type="hobby" isShared />)}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No shared hobbies, but maybe you can teach each other something new!</p>
                )}
            </Section>

            <Section title="Other Hobbies" icon={<InformationCircleIcon className="w-4 h-4" />}>
                <div className="flex flex-wrap">
                    {uniqueHobbies.map(hobby => <Chip key={hobby.id} text={hobby.name} type="hobby" />)}
                </div>
            </Section>
        </div>
    </GlassCard>
  );
};

export default UserCard;
