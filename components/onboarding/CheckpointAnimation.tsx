import React from 'react';

interface CheckpointAnimationProps {
    isVisible: boolean;
}

const CheckpointAnimation: React.FC<CheckpointAnimationProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-[100]"
            aria-live="polite"
            role="status"
        >
            <div className="bg-white dark:bg-dark-bg p-6 rounded-full animate-pop-in">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-16 h-16 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>
            <style>{`
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in {
                    animation: pop-in 0.5s ease-out forwards;
                }
            `}</style>
             <span className="sr-only">Step completed!</span>
        </div>
    );
};

export default CheckpointAnimation;
