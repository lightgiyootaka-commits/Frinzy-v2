import React from 'react';

interface StickerCardProps {
    text: string;
    color: string;
    isSelected: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

const StickerCard: React.FC<StickerCardProps> = ({ text, color, isSelected, isDisabled, onClick }) => {
    
    const baseClasses = "w-full h-24 flex items-center justify-center p-2 rounded-2xl text-center cursor-pointer transition-all duration-200 transform";
    
    const stateClasses = isSelected
        ? `${color} text-white scale-110 shadow-lg ring-4 ring-white`
        : isDisabled
        ? `bg-white/10 text-gray-400 opacity-50 cursor-not-allowed`
        : `bg-white/20 text-white hover:scale-105 hover:bg-white/30 active:scale-100`;

    return (
        <button onClick={onClick} disabled={isDisabled} className={`${baseClasses} ${stateClasses}`}>
            <span className="font-bold text-lg">{text}</span>
        </button>
    );
};

export default StickerCard;