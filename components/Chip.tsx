import React from 'react';
import { SparklesIcon, UserGroupIcon } from './icons/Icons';

interface ChipProps {
    text: string;
    type: 'vibe' | 'hobby' | 'prompt';
    isShared?: boolean;
}

const Chip: React.FC<ChipProps> = ({ text, type, isShared = false }) => {
    const typeStyles = {
        vibe: 'bg-purple-500/80 text-white',
        hobby: 'bg-blue-500/80 text-white',
        prompt: 'bg-pink-500/80 text-white',
    };
    
    const sharedClasses = isShared
        ? 'bg-gradient-to-r from-secondary to-blue-400 text-white ring-2 ring-white/50'
        : typeStyles[type];
    
    const iconMap: Record<string, JSX.Element> = {
       'Small group': <UserGroupIcon className="w-3 h-3 mr-1.5" />,
       'Try new spots': <SparklesIcon className="w-3 h-3 mr-1.5" />,
    };

    const getIcon = (text: string) => {
        if(type !== 'vibe') return null;
        return iconMap[text] || null;
    }

    return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold mr-2 mb-2 ${sharedClasses} transition-all duration-300 ${isShared ? 'shadow-lg' : ''}`}>
            {getIcon(text)}
            {text}
        </div>
    );
};

export default Chip;