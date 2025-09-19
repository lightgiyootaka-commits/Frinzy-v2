// Fix: Implementing the personality quiz screen component.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PERSONALITY_QUESTIONS } from '../../constants';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';

const PersonalityQuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = PERSONALITY_QUESTIONS[currentQuestionIndex];
  const totalQuestions = PERSONALITY_QUESTIONS.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleAnswer = (option: string, trait: string) => {
    const newAnswers = { ...answers, [trait]: option };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        handleSubmit(newAnswers);
    }
  };

  const calculatePersonalityType = (finalAnswers: Record<string, string>): string => {
    let type = '';
    // This is a simplified mapping. A real app might have more complex logic.
    type += (finalAnswers["Introvert/Extrovert"] === PERSONALITY_QUESTIONS[0].options[0]) ? 'E' : 'I';
    type += (finalAnswers["Sensing/Intuition"] === PERSONALITY_QUESTIONS[2].options[0] || finalAnswers["Sensing/Intuition-2"] === PERSONALITY_QUESTIONS[4].options[0]) ? 'S' : 'N';
    type += (finalAnswers["Thinking/Feeling"] === PERSONALITY_QUESTIONS[1].options[0]) ? 'T' : 'F';
    type += (finalAnswers["Judging/Perceiving"] === PERSONALITY_QUESTIONS[3].options[0]) ? 'J' : 'P';
    
    const descriptions: Record<string, string> = {
        'ISTJ': 'The Inspector', 'ISFJ': 'The Protector', 'INFJ': 'The Advocate', 'INTJ': 'The Architect',
        'ISTP': 'The Crafter', 'ISFP': 'The Artist', 'INFP': 'The Mediator', 'INTP': 'The Thinker',
        'ESTP': 'The Dynamo', 'ESFP': 'The Performer', 'ENFP': 'The Champion', 'ENTP': 'The Debater',
        'ESTJ': 'The Supervisor', 'ESFJ': 'The Provider', 'ENFJ': 'The Teacher', 'ENTJ': 'The Commander'
    };

    return `${type} - ${descriptions[type] || 'The Individual'}`;
  };

  const handleSubmit = (finalAnswers: Record<string, string>) => {
    if (Object.keys(finalAnswers).length >= totalQuestions) {
        const personalityType = calculatePersonalityType(finalAnswers);
        updateUser({ personalityType });
        console.log('Quiz completed. Personality type:', personalityType);
        navigate('/profile');
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
        navigate(-1); // Go back to the previous page if on the first question
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
        <GlassCard>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5 mb-6">
                <div className="bg-gradient-to-r from-secondary to-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                
                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(option, currentQuestion.trait)}
                            variant="secondary"
                            size="lg"
                            className="w-full text-left !justify-start p-4"
                        >
                           {option}
                        </Button>
                    ))}
                </div>
            </div>
             <div className="mt-8 flex justify-between items-center">
                <Button onClick={handleBack} variant="secondary" size="sm">Back</Button>
                {currentQuestionIndex === totalQuestions - 1 && 
                    <p className="text-sm text-gray-500">Last question!</p>
                }
            </div>
        </GlassCard>
    </div>
  );
};

export default PersonalityQuizScreen;
