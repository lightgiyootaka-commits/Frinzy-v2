import React from 'react';
import GlassCard from '../../components/GlassCard';
import { ChatBubbleLeftRightIcon } from '../../components/icons/Icons';

const ChatPlaceholder: React.FC = () => {
  return (
    <GlassCard className="w-full h-full flex flex-col items-center justify-center text-center">
      <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h2 className="text-2xl font-bold">Your Conversations</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Select a chat from the list on the left to start messaging.</p>
    </GlassCard>
  );
};

export default ChatPlaceholder;