import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Match, Message, User } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { generateIcebreakers } from '../../services/geminiService';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/GlassCard';
import { PaperAirplaneIcon, SparklesIcon, ArrowLeftIcon } from '../../components/icons/Icons';
import Button from '../../components/Button';

const ChatScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;
    
    // Fetch initial chat data
    const loadChat = async () => {
      setNewMessage('');
      setIcebreakers([]);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('timestamp', { ascending: true });
        
      if (error) console.error("Error fetching messages:", error);
      else setMessages(data as Message[]);
      
      // Fetch other user's profile
       const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .eq('id', matchId)
        .single();
        
       if(matchError) {
           console.error("Error fetching match details:", matchError);
           return;
       }

       const otherUserId = matchData.user1_id === user.id ? matchData.user2_id : matchData.user1_id;

       const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();

       if(profileError) console.error("Error fetching other user's profile:", profileError);
       else setOtherUser(profileData as User);
    };

    loadChat();

    // Subscribe to real-time messages
    const channel = supabase.channel(`chat:${matchId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `match_id=eq.${matchId}` 
      }, (payload) => {
        setMessages(currentMessages => [...currentMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGetIcebreakers = async () => {
    if (!otherUser || !user) return;
    setIsLoadingIcebreakers(true);
    const suggestions = await generateIcebreakers(user, otherUser);
    setIcebreakers(suggestions);
    setIsLoadingIcebreakers(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !matchId) return;
    
    const msg = {
      match_id: matchId,
      senderId: user.id, // column name might be sender_id in your db
      text: newMessage,
      timestamp: new Date().getTime(),
    };
    
    setNewMessage(''); // Clear input immediately for better UX
    
    const { error } = await supabase.from('messages').insert(msg);
    if (error) {
      console.error("Error sending message:", error);
      setNewMessage(newMessage); // Restore message on error
    }
  };

  if (!otherUser || !user) {
    return <div className="text-center p-10">Loading chat...</div>;
  }

  return (
    <GlassCard className="flex flex-col h-full w-full">
      <div className="flex items-center p-4 border-b border-white/20">
        <Link to="/chat" className="md:hidden mr-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
          <ArrowLeftIcon className="w-5 h-5"/>
        </Link>
        <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3" />
        <h2 className="text-xl font-bold">{otherUser.name}</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === user.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {icebreakers.length > 0 && (
        <div className="p-2 border-t border-white/20">
          <p className="text-sm text-gray-500 mb-2">Try an icebreaker:</p>
          <div className="flex flex-wrap gap-2">
            {icebreakers.map((ib, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewMessage(ib);
                  setIcebreakers([]);
                }}
                className="bg-secondary/20 text-secondary dark:text-blue-300 text-sm px-3 py-1 rounded-full hover:bg-secondary/30"
              >
                "{ib}"
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button onClick={handleGetIcebreakers} disabled={isLoadingIcebreakers} type="button" variant="secondary" className="p-2 rounded-full">
            <SparklesIcon className="w-6 h-6 text-primary" />
          </Button>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUser.name}...`}
            className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-2 rounded-full bg-primary text-white disabled:opacity-50" disabled={!newMessage.trim()}>
            <PaperAirplaneIcon className="w-6 h-6"/>
          </button>
        </form>
      </div>
    </GlassCard>
  );
};

export default ChatScreen;
