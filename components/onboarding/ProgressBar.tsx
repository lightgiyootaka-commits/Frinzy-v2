import React from 'react';

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  const progress = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="w-full h-1 bg-white/20 rounded-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-1 bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
       <span className="sr-only">Onboarding {progress}% complete.</span>
    </div>
  );
};

export default ProgressBar;
