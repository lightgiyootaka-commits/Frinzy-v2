import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Match, User } from '../../types';
import GlassCard from '../../components/GlassCard';

// Temporary simplified match type for this layout
interface MatchWithUsers extends Match {
    users: User[];
}

const ChatListItem: React.FC<{ match: MatchWithUsers }> = ({ match }) => {
  const { user } = useAuth();
  const otherUser = match.users.find(u => u.id !== user?.id);
  // Last message would need another query or be part of the initial fetch, simplifying for now
  const lastMessage = "Say hello!"; 

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
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage}</p>
      </div>
    </NavLink>
  );
};

const ChatLayout: React.FC = () => {
  const { user } = useAuth();
  const { matchId } = useParams<{ matchId: string }>();
  const [matches, setMatches] = useState<MatchWithUsers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadMatches = async () => {
      setLoading(true);
      // This query is a bit complex. It finds matches for the current user
      // and then fetches the profiles of both users in the match.
      // An RPC in Supabase would be more efficient.
      const { data: matchIds, error } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
          console.error("Error fetching matches:", error);
          setLoading(false);
          return;
      }
      
      const userIds = new Set<string>();
      matchIds.forEach(m => {
          userIds.add(m.user1_id);
          userIds.add(m.user2_id);
      });
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      if (profileError) {
          console.error("Error fetching profiles for matches:", profileError);
          setLoading(false);
          return;
      }

      const profilesById = new Map(profiles.map(p => [p.id, p]));

      const populatedMatches = matchIds.map(match => ({
          id: match.id,
          users: [profilesById.get(match.user1_id), profilesById.get(match.user2_id)].filter(Boolean) as User[],
          messages: [] // messages are fetched in ChatScreen
      }));

      setMatches(populatedMatches);
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
