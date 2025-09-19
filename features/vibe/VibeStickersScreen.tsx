import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import StickerCard from '../../components/onboarding/StickerCard';
import { useProgress } from '../../contexts/ProgressContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useCelebration } from '../../contexts/CelebrationContext';
import { VIBE_STICKERS } from './constants';

const VibeStickersScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setProgress } = useProgress();
    const { updateOnboardingData } = useOnboarding();
    const { fireCheckpoint } = useCelebration();
    const [selections, setSelections] = useState<string[]>([]);
    const MAX_SELECTIONS = 2;

    useEffect(() => {
        setProgress(80);
    }, [setProgress]);

    const handleSelect = (stickerText: string) => {
        setSelections(prev => {
            if (prev.includes(stickerText)) {
                return prev.filter(item => item !== stickerText);
            }
            if (prev.length < MAX_SELECTIONS) {
                return [...prev, stickerText];
            }
            return prev;
        });
    };

    const isSelected = (stickerText: string) => selections.includes(stickerText);
    const isMaxedOut = selections.length >= MAX_SELECTIONS;

    const handleSubmit = () => {
        updateOnboardingData({ vibeStickers: selections });
        fireCheckpoint();
        setTimeout(() => {
            navigate('/vibe/fun-line');
        }, 600);
    };

    return (
        <GlassCard className="w-full">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">What's Your Vibe?</h2>
            <p className="text-center text-indigo-200 mb-6">Pick {MAX_SELECTIONS} that feel most like you.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {VIBE_STICKERS.map(sticker => (
                    <StickerCard
                        key={sticker.id}
                        text={sticker.text}
                        color={sticker.color}
                        isSelected={isSelected(sticker.text)}
                        isDisabled={!isSelected(sticker.text) && isMaxedOut}
                        onClick={() => handleSelect(sticker.text)}
                    />
                ))}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={selections.length !== MAX_SELECTIONS}
                size="lg"
                className="w-full !mt-8"
            >
                Continue ({selections.length}/{MAX_SELECTIONS})
            </Button>
        </GlassCard>
    );
};

export default VibeStickersScreen;