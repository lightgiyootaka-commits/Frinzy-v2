import React from 'react';

type IconName = 'Moon' | 'Building' | 'Calendar' | 'Wave' | 'Chat' | 'Happy' | 'Users' | 'UserGroup' | 'Sparkles' | 'Home' | 'Sun' | 'Stars';

interface IconProps {
    name: IconName;
    className?: string;
}

const VibeIcon: React.FC<IconProps> = ({ name, className = "w-8 h-8 mb-2" }) => {
    const icons: Record<IconName, JSX.Element> = {
        Moon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />,
        Building: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 21v-2.25a2.25 2.25 0 0 1 2.25-2.25h3.75a2.25 2.25 0 0 1 2.25 2.25V21" />,
        Calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />,
        Wave: <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12.75c3.34 0 6.04-2.43 6.04-5.43s-2.7-5.43-6.04-5.43c-3.34 0-6.04 2.43-6.04 5.43s2.7 5.43 6.04 5.43zM3.75 12.75c3.34 0 6.04-2.43 6.04-5.43s-2.7-5.43-6.04-5.43C.41 1.9 3.11- .53 3.11-3.53s-2.7-5.43-6.04-5.43M3.75 21.75c3.34 0 6.04-2.43 6.04-5.43s-2.7-5.43-6.04-5.43C.41 10.9 3.11 8.47 3.11 5.47s-2.7-5.43-6.04-5.43" />,
        Chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.543-.335A5.997 5.997 0 0 1 4.5 16.5v-2.543a9.76 9.76 0 0 1-.335-2.543C4.165 7.03 7.94 3.75 12.5 3.75c4.97 0 9 3.694 9 8.25Z" />,
        Happy: <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" />,
        Users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.063M16.5 7.875a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-3.75 10.5a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />,
        UserGroup: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.75-5.325T21 12a9 9 0 1 0-18 0 9 9 0 0 0 9 9h.75a9.094 9.094 0 0 0 5.325-3.75M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-12 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
        Sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75" />,
        Home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
        Sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" />,
        Stars: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />,
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            {icons[name]}
        </svg>
    );
};

interface ChoiceCardProps {
    text: string;
    icon: IconName;
    isSelected: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ text, icon, isSelected, isDisabled, onClick }) => {
    const baseClasses = "flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center cursor-pointer transition-all duration-200 transform";
    const stateClasses = isSelected
        ? "bg-primary border-primary text-white scale-105 shadow-lg"
        : isDisabled
        ? "bg-white/10 border-white/20 text-gray-400 opacity-60 cursor-not-allowed"
        : "bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 active:scale-100";

    return (
        <button onClick={onClick} disabled={isDisabled} className={`${baseClasses} ${stateClasses}`}>
            <VibeIcon name={icon} />
            <span className="font-semibold">{text}</span>
        </button>
    );
};

export default ChoiceCard;
