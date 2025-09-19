import React, { createContext, useState, useContext, ReactNode } from 'react';
import { City, Gender, Hobby } from '../types';

// This interface holds all the data we collect during the entire onboarding flow
export interface OnboardingData {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  gender?: Gender;
  city?: City;
  hobbies?: Hobby[];
  bio?: string;
  thisOrThat?: string[];
  vibeStickers?: string[];
  funLine?: string | null;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (newData: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const updateOnboardingData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};