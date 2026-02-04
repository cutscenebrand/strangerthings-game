import React, { useState, useEffect } from 'react';
import { Question, Language } from '../types';
import TypewriterText from './TypewriterText';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { playSound } from './SoundController';

interface QuizScreenProps {
  questions: Question[];
  currentLevel: number;
  totalDiscount: number;
  onAnswer: (isCorrect: boolean, reward: number) => void;
  t: any;
  lang: Language;
}

const TIMER_SECONDS = 15;

const QuizScreen: React.FC<QuizScreenProps> = ({ 
  questions, 
  currentLevel, 
  totalDiscount, 
  onAnswer,
  t,
  lang
}) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const question = questions[currentLevel];
  const isLastQuestion = currentLevel === questions.length - 1;

  // Timer logic
  useEffect(() => {
    if (isRevealed || isTransitioning) return;
    
    if (timeLeft <= 0) {
      handleOptionClick(-1); // Time out
      return;
    }

    if (timeLeft <= 5 && timeLeft > 0) {
        playSound('click'); 
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRevealed, isTransitioning]);

  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setSelectedOption(null);
    setIsRevealed(false);
    setGlitchActive(false);
    
    const timer = setTimeout(() => {
        setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentLevel]);

  const handleOptionClick = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);

    const isCorrect = index === question.correctAnswerIndex;
    
    if (isCorrect) {
        playSound('correct');
    } else {
        playSound('wrong');
        setGlitchActive(true);
    }
    
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
          onAnswer(isCorrect, question.rewardPercentage);
      }, 200);
    }, 1200);
  };

  const getButtonState = (index: number) => {
    if (!isRevealed) return 'default';
    if (index === question.correctAnswerIndex) return 'correct';
    if (index === selectedOption) return 'incorrect';
    return 'dimmed';
  };

  const isPanicMode = timeLeft <= 5 && !isRevealed;

  return (
    <div 
        className={`relative h-screen w-full flex flex-col bg-cutscene-bg px-4 sm:px-8 pt-8 sm:pt-12 pb-6 overflow-hidden transition-all duration-300 ${glitchActive ? 'animate-glitch' : ''} ${isPanicMode ? 'animate-heartbeat shadow-[inset_0_0_100px_rgba(239,68,68,0.2)]' : ''}`} 
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
       
       {isTransitioning && (
           <div className="absolute inset-0 z-[100] pointer-events-none">
               <div className="absolute inset-0 bg-cutscene-bg/20 backdrop-blur-md animate-pulse"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200/90 to-transparent w-full h-full blur-xl animate-flash-wipe mix-blend-screen"></div>
           </div>
       )}

       {/* Top Bar */}
       <div className="flex justify-between items-center mb-6 sm:mb-8 animate-slide-up">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">{t.totalDiscount}</span>
            <span className={`text-2xl sm:text-3xl font-display font-bold drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-colors ${glitchActive ? 'text-red-500' : 'text-cutscene-blue'}`}>
              {totalDiscount}% OFF
            </span>
          </div>
          <div className={`flex items-center gap-2 text-white/80 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-300 ${isPanicMode ? 'border-red-500 bg-red-900/40 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'border-white/10'}`}>
            <Clock size={14} className={isPanicMode ? 'text-white' : 'sm:w-[16px] sm:h-[16px]'} />
            <span className={`font-mono font-bold text-sm sm:text-base ${isPanicMode ? 'text-white' : ''}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="flex w-full mb-6 sm:mb-10 relative px-1 py-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
         <div className="flex justify-between w-full gap-1.5 sm:gap-3">
            {questions.map((_, idx) => {
               const isActive = idx === currentLevel;
               const isPast = idx < currentLevel;
               return (
                 <div key={idx} className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all duration-500 ${isActive ? 'bg-cutscene-blue shadow-[0_0_10px_#7dd3fc] scale-y-125' : isPast ? 'bg-cutscene-blue/40' : 'bg-slate-800'}`}></div>
               );
            })}
         </div>
       </div>

       {/* Question Area - Responsive Font Sizes */}
       <div className="flex-1 flex flex-col justify-center mb-6 sm:mb-10 relative z-10">
          <div className="mb-4 text-[9px] sm:text-[10px] font-bold text-cutscene-blue uppercase tracking-widest border border-cutscene-blue/30 inline-block px-2 py-1 rounded w-max">
            {t.scene} {currentLevel + 1} • {question.difficulty}
          </div>
          <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-tight drop-shadow-md ${lang === 'ar' ? 'leading-relaxed' : ''}`}>
            <TypewriterText 
                key={question.id} 
                text={question.text} 
                speed={25} 
                className="block"
            />
          </h3>
       </div>

       {/* Options Area - Better Padding and Sizing */}
       <div className="grid grid-cols-1 gap-2.5 sm:gap-4 w-full relative z-10 max-w-2xl mx-auto">
         {question.options.map((option, idx) => {
           const state = getButtonState(idx);
           let baseClasses = "w-full p-3.5 sm:p-5 border rounded-xl transition-all duration-200 relative overflow-hidden group animate-slide-up ";
           
           baseClasses += lang === 'ar' ? "text-right " : "text-left ";

           if (state === 'default') {
             baseClasses += "border-white/10 bg-white/5 text-slate-300 hover:border-cutscene-blue hover:text-white hover:bg-white/10 active:scale-[0.98]";
           } else if (state === 'correct') {
             baseClasses += "border-green-500 bg-green-500/20 text-green-400 font-bold shadow-[0_0_20px_rgba(34,197,94,0.2)]";
           } else if (state === 'incorrect') {
             baseClasses += "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
           } else if (state === 'dimmed') {
             baseClasses += "border-white/5 text-slate-600 opacity-40";
           }

           return (
             <button
               key={idx}
               disabled={isRevealed}
               onClick={() => handleOptionClick(idx)}
               className={baseClasses}
               style={{ animationDelay: `${400 + (idx * 80)}ms` }}
             >
               <div className="flex justify-between items-center z-10 relative">
                 <span className="uppercase tracking-widest text-xs sm:text-sm font-medium">{option}</span>
                 {state === 'correct' && <CheckCircle2 size={16} className="sm:w-[20px] sm:h-[20px] animate-bounce" />}
                 {state === 'incorrect' && <XCircle size={16} className="sm:w-[20px] sm:h-[20px] animate-pulse" />}
               </div>
               {state === 'default' && (
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
               )}
             </button>
           );
         })}
       </div>

       <div className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
          {isLastQuestion ? t.finalScene : t.answerPrompt}
       </div>
    </div>
  );
};

export default QuizScreen;