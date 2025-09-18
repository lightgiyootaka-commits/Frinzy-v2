
import React from 'react';
import { Hobby } from '../types';

interface HobbyPillProps {
  hobby: Hobby;
}

const HobbyPill: React.FC<HobbyPillProps> = ({ hobby }) => {
  return (
    <span className="inline-block bg-primary/20 text-primary dark:text-purple-300 dark:bg-primary/30 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
      {hobby.name}
    </span>
  );
};

export default HobbyPill;
