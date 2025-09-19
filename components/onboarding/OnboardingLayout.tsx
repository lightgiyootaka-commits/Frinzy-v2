import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProgressProvider, useProgress } from '../../contexts/ProgressContext';
import { CelebrationProvider } from '../../contexts/CelebrationContext';
import ProgressBar from './ProgressBar';

const OnboardingContent: React.FC = () => {
    const { progress } = useProgress();
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="w-full max-w-lg">
                <div className="mb-4">
                    <ProgressBar percent={progress} />
                </div>
                <Outlet />
            </div>
        </div>
    );
}

const OnboardingLayout: React.FC = () => {
  return (
    <ProgressProvider>
      <CelebrationProvider>
        <OnboardingContent />
      </CelebrationProvider>
    </ProgressProvider>
  );
};

export default OnboardingLayout;
