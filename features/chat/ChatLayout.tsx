import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMatchesForUser } from '../../services/mockApi';
import { Match } from '../../types';
import GlassCard from '../../components/GlassCard';

const ChatListItem: React.FC<{ match: Match }> = ({ match }) => {
  const { user } = useAuth();
  const otherUser = match.users.find(u => u.id !== user?.id);
  const lastMessage = match.messages[match.messages.length - 1];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 rounded-xl transition-colors w-full text-left ${
      isActive ? 'bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  if (!otherUser) return null;

  return (
    <NavLink to={`/chat/${match.id}`} className={navLinkClasses}>
      <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full mr-3 object-cover" />
      <div className="flex-grow overflow-hidden">
        <h3 className="font-bold truncate">{otherUser.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage?.text}</p>
      </div>
    </NavLink>
  );
};

const ChatLayout: React.FC = () => {
  const { user } = useAuth();
  const { matchId } = useParams<{ matchId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadMatches = async () => {
      setLoading(true);
      const userMatches = await fetchMatchesForUser(user.id);
      setMatches(userMatches);
      setLoading(false);
    };
    loadMatches();
  }, [user]);

  return (
    <div className="flex flex-grow gap-6">
      <aside className={`
        ${matchId ? 'hidden md:flex' : 'flex w-full'}
        md:w-1/3 lg:w-1/4 flex-col
      `}>
        <GlassCard className="w-full flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-4 px-2">Chats</h2>
          <div className="flex-grow overflow-y-auto pr-1 space-y-2">
            {loading ? (
              <p>Loading matches...</p>
            ) : matches.length > 0 ? (
              matches.map(match => <ChatListItem key={match.id} match={match} />)
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No matches yet. Go like some people!</p>
            )}
          </div>
        </GlassCard>
      </aside>
      <main className={`
        ${matchId ? 'flex w-full' : 'hidden md:flex'}
        md:flex-grow flex flex-col
      `}>
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout;