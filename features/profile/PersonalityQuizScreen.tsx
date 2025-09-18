
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PersonalityType } from '../../types';
import { PERSONALITY_QUESTIONS } from '../../constants';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';

const PersonalityQuizScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, determine personality type and "log in"
      // This is a very simplified mapping for demonstration
      const personality = determinePersonality(newAnswers);
      console.log('Determined Personality:', personality);
      // In a real app, you'd save this to the user's profile in Firestore
      // Then, log the user in.
      login(); // This will load mock user with a pre-set personality for now
      navigate('/discover');
    }
  };
  
  const determinePersonality = (userAnswers: string[]): PersonalityType => {
      // Dummy logic to assign a personality. A real app would have a more complex algorithm.
      const extrovertCount = userAnswers.filter(a => a.includes("party")).length;
      if (extrovertCount > 0) return PersonalityType.TheCampaigner;
      return PersonalityType.TheMediator;
  }

  const currentQuestion = PERSONALITY_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / PERSONALITY_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
      <GlassCard className="w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-center mb-2">Let's find your vibe!</h2>
        <p className="text-center text-indigo-200 mb-6">Answer a few questions to find your personality type.</p>

        <div className="w-full bg-white/20 rounded-full h-2.5 mb-6">
          <div className="bg-white h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 bg-white/20 border border-white/30 rounded-lg text-left hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default PersonalityQuizScreen;
