import React from 'react';
import { Hobby } from '../types';

interface HobbyPillProps {
  hobby: Hobby;
  isShared?: boolean;
}

const HobbyPill: React.FC<HobbyPillProps> = ({ hobby, isShared = false }) => {
  const sharedClasses = isShared
    ? 'bg-gradient-to-r from-secondary to-blue-400 text-white ring-2 ring-white/50'
    : 'bg-primary/20 text-primary dark:text-purple-300 dark:bg-primary/30';

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 transition-all duration-300 ${sharedClasses} ${isShared ? 'shadow-lg' : ''}`}>
      {hobby.name}
    </span>
  );
};

export default HobbyPill;