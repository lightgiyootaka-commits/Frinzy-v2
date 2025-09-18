
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-light-card dark:bg-dark-card backdrop-blur-xl rounded-2xl border border-white/20 shadow-glass p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
