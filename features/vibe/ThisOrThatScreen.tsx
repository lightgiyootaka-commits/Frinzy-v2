import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import ChoiceCard from '../../components/onboarding/ChoiceCard';
import { useProgress } from '../../contexts/ProgressContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useCelebration } from '../../contexts/CelebrationContext';
import { THIS_OR_THAT_OPTIONS } from './constants';

const ThisOrThatScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setProgress } = useProgress();
    const { updateOnboardingData } = useOnboarding();
    const { fireCheckpoint } = useCelebration();
    const [selections, setSelections] = useState<string[]>([]);
    const MAX_SELECTIONS = 3;

    useEffect(() => {
        setProgress(60);
    }, [setProgress]);

    const handleSelect = (choice: string) => {
        setSelections(prev => {
            if (prev.includes(choice)) {
                return prev.filter(item => item !== choice);
            }
            if (prev.length < MAX_SELECTIONS) {
                return [...prev, choice];
            }
            return prev;
        });
    };

    const isSelected = (choice: string) => selections.includes(choice);
    const isMaxedOut = selections.length >= MAX_SELECTIONS;

    const handleSubmit = () => {
        updateOnboardingData({ thisOrThat: selections });
        fireCheckpoint();
        setTimeout(() => {
            navigate('/vibe/stickers');
        }, 600);
    };

    return (
        <GlassCard className="w-full">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">This or That?</h2>
            <p className="text-center text-indigo-200 mb-6">Tell us your style. Choose {MAX_SELECTIONS}.</p>
            
            <div className="space-y-4">
                {THIS_OR_THAT_OPTIONS.map(pair => (
                    <div key={pair.id} className="grid grid-cols-2 gap-4">
                        <ChoiceCard 
                            text={pair.choiceA.text}
                            icon={pair.choiceA.icon as any}
                            isSelected={isSelected(pair.choiceA.text)}
                            isDisabled={!isSelected(pair.choiceA.text) && isMaxedOut}
                            onClick={() => handleSelect(pair.choiceA.text)}
                        />
                        <ChoiceCard 
                            text={pair.choiceB.text}
                            icon={pair.choiceB.icon as any}
                            isSelected={isSelected(pair.choiceB.text)}
                            isDisabled={!isSelected(pair.choiceB.text) && isMaxedOut}
                            onClick={() => handleSelect(pair.choiceB.text)}
                        />
                    </div>
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

export default ThisOrThatScreen;