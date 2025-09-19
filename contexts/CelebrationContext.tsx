import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import CheckpointAnimation from '../components/onboarding/CheckpointAnimation';

// This is loaded from CDN in index.html
declare var confetti: any;

interface CelebrationContextType {
  fireCheckpoint: () => void;
  fireConfetti: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export const CelebrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCheckpointVisible, setIsCheckpointVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const fireCheckpoint = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsCheckpointVisible(true);
    setTimeout(() => setIsCheckpointVisible(false), 1000); // Animation duration
  }, [prefersReducedMotion]);

  const fireConfetti = useCallback(() => {
    if (prefersReducedMotion || typeof confetti === 'undefined') return;

    const colors = ['#8B5CF6', '#3B82F6', '#EC4899'];
    
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: colors,
    });

  }, [prefersReducedMotion]);

  return (
    <CelebrationContext.Provider value={{ fireCheckpoint, fireConfetti }}>
      {children}
      <CheckpointAnimation isVisible={isCheckpointVisible} />
    </CelebrationContext.Provider>
  );
};

export const useCelebration = (): CelebrationContextType => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};
