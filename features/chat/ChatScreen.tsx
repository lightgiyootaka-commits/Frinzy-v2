import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Match, Message } from '../../types';
import { fetchMatchDetails } from '../../services/mockApi';
import { generateIcebreakers } from '../../services/geminiService';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/GlassCard';
import { PaperAirplaneIcon, SparklesIcon, ArrowLeftIcon } from '../../components/icons/Icons';
import Button from '../../components/Button';

const ChatScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId) return;
    const loadMatch = async () => {
      setNewMessage('');
      setIcebreakers([]);
      const fetchedMatch = await fetchMatchDetails(matchId);
      if (fetchedMatch) {
        setMatch(fetchedMatch);
        setMessages(fetchedMatch.messages);
      }
    };
    loadMatch();
  }, [matchId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGetIcebreakers = async () => {
    if (!match || !match.users) return;
    setIsLoadingIcebreakers(true);
    const suggestions = await generateIcebreakers(match.users[0], match.users[1]);
    setIcebreakers(suggestions);
    setIsLoadingIcebreakers(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      text: newMessage,
      timestamp: Date.now(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (!match || !user) {
    return <div className="text-center p-10">Loading chat...</div>;
  }

  const otherUser = match.users.find(u => u.id !== user.id);

  return (
    <GlassCard className="flex flex-col h-full w-full">
      <div className="flex items-center p-4 border-b border-white/20">
        <Link to="/chat" className="md:hidden mr-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
          <ArrowLeftIcon className="w-5 h-5"/>
        </Link>
        <img src={otherUser?.avatarUrl} alt={otherUser?.name} className="w-10 h-10 rounded-full mr-3" />
        <h2 className="text-xl font-bold">{otherUser?.name}</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex mb-4 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
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
              <button key={index} onClick={() => setNewMessage(ib)} className="bg-secondary/20 text-secondary dark:text-blue-300 text-sm px-3 py-1 rounded-full hover:bg-secondary/30">
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
            placeholder={`Message ${otherUser?.name}...`}
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