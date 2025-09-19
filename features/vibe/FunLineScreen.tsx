import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useProgress } from '../../contexts/ProgressContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useCelebration } from '../../contexts/CelebrationContext';
import { useAuth } from '../../contexts/AuthContext';
import { FUN_LINE_PROMPTS } from './constants';
import { TraitHints } from '../../types';

const FunLineScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setProgress } = useProgress();
    const { onboardingData } = useOnboarding();
    const { fireConfetti } = useCelebration();
    const { user, updateUser } = useAuth();
    
    const [answer, setAnswer] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const prompt = useMemo(() => FUN_LINE_PROMPTS[Math.floor(Math.random() * FUN_LINE_PROMPTS.length)], []);

    useEffect(() => {
        setProgress(95);
    }, [setProgress]);
    
    const deriveTraitHints = (thisOrThat: string[] = []): TraitHints => {
        const hints: TraitHints = {};
        const selections = new Set(thisOrThat);

        if (selections.has('Small group') || selections.has('Calm night in')) {
            hints.introvert = true;
        }
        if (selections.has('Big crowd') || selections.has('City night out')) {
            hints.introvert = false;
        }
        if (selections.has('Try new spots')) {
            hints.openness = true;
        }
        if (selections.has('Plan ahead')) {
            hints.conscientious = true;
        }
        if (selections.has('Night owl')) {
            hints.nightOwl = true;
        }

        return hints;
    };


    const handleFinish = async (skipped = false) => {
        if (!user) {
            console.error("No authenticated user found. Cannot finish onboarding.");
            // Optionally, navigate to login or show an error
            navigate('/login');
            return;
        }

        setIsSaving(true);
        setProgress(100);
        
        const funLine = skipped ? null : answer;
        
        const traitHints = deriveTraitHints(onboardingData.thisOrThat);
        
        const finalProfileData = {
          ...onboardingData,
          funLine,
          traitHints,
          // Set some defaults for fields not in onboarding
          personalityType: "Newcomer",
          points: 0,
          isVerified: false,
          avatarUrl: `https://i.pravatar.cc/300?u=${user.id}`, // Default avatar
        };

        try {
            await updateUser(finalProfileData);
            fireConfetti();
            setTimeout(() => {
                navigate('/discover', { replace: true });
            }, 1200);
        } catch (error) {
            console.error("Failed to save profile:", error);
            // Show an error message to the user
            setIsSaving(false);
        }
    };

    return (
        <GlassCard className="w-full">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">Almost there!</h2>
            <p className="text-center text-indigo-200 mb-6">One last thing (it's optional!).</p>

            <div className="bg-black/20 p-4 rounded-lg text-center">
                <label htmlFor="fun-line" className="block text-indigo-100 font-semibold mb-3">{prompt}</label>
                <input
                    id="fun-line"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Your answer..."
                    maxLength={80}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
                <Button onClick={() => handleFinish(true)} size="lg" variant="secondary" disabled={isSaving}>
                    Skip
                </Button>
                <Button onClick={() => handleFinish(false)} size="lg" disabled={!answer.trim() || isSaving}>
                    {isSaving ? 'Saving...' : 'Finish'}
                </Button>
            </div>
        </GlassCard>
    );
};

export default FunLineScreen;
