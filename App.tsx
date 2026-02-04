import React, { useState, useEffect } from 'react';
import FilmGrain from './components/FilmGrain';
import LandingScreen from './components/LandingScreen';
import RegistrationScreen from './components/RegistrationScreen';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import AppLoader from './components/AppLoader';
import SoundController from './components/SoundController'; 
import { GameState, Question, UserData, Language } from './types';
import { generateQuestions } from './services/geminiService';
import { updateUserScore } from './services/db';
import { Loader2 } from 'lucide-react';
import { TRANSLATIONS } from './constants';

const STORAGE_KEY_USER = 'cutscene_user_v1';
const STORAGE_KEY_DISCOUNT = 'cutscene_discount_v1';
const STORAGE_KEY_COMPLETED = 'cutscene_completed_v1';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // DISABLED AUTO-LOAD FROM STORAGE TO ENSURE FRESH START ON REFRESH
  // useEffect(() => {
  //   const savedUser = localStorage.getItem(STORAGE_KEY_USER);
  //   const savedDiscount = localStorage.getItem(STORAGE_KEY_DISCOUNT);
  //   // Note: Completion check is handled in handleSplashComplete
  //   if (savedUser) {
  //     setUserData(JSON.parse(savedUser));
  //   }
  //   if (savedDiscount) {
  //     setTotalDiscount(parseInt(savedDiscount, 10));
  //   }
  // }, []);

  // Pre-load questions based on language
  useEffect(() => {
    const loadData = async () => {
      const q = await generateQuestions(language);
      setQuestions(q);
    };
    loadData();
  }, [language]); // Reload when language changes

  // Save state updates (Optional: keep this if we want to survive refresh during game, 
  // but since we disabled load, this just writes to disk without reading back)
  useEffect(() => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    }
    if (totalDiscount > 0) {
      localStorage.setItem(STORAGE_KEY_DISCOUNT, totalDiscount.toString());
    }
  }, [userData, totalDiscount]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleSplashComplete = () => {
    // Force Landing every time splash finishes
    setGameState('landing');
  };

  const handleStart = () => {
    setGameState('registration');
  };

  const handleShowLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data);
    setGameState('intro');
  };

  const handleBackToLanding = () => {
    setGameState('landing');
  };

  const handleEnter = () => {
    if (questions.length === 0) {
      setGameState('loading');
      setTimeout(() => setGameState('playing'), 2000); 
    } else {
      setGameState('playing');
    }
  };

  const handleAnswer = (isCorrect: boolean, reward: number) => {
    if (isCorrect) {
      const newTotal = totalDiscount + reward;
      setTotalDiscount(newTotal);
      
      const nextLevel = currentLevel + 1;
      
      if (nextLevel < questions.length) {
        setCurrentLevel(nextLevel);
      } else {
        finishGame(newTotal);
      }
    } else {
      finishGame(totalDiscount);
    }
  };

  const finishGame = async (finalDiscount: number) => {
    setGameState('result');
    localStorage.setItem(STORAGE_KEY_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEY_DISCOUNT, finalDiscount.toString());

    // Update Score in DB
    if (userData?.phone) {
        await updateUserScore(userData.phone, finalDiscount);
    }
  };

  const handleRestart = () => {
    // Full Reset Logic
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_DISCOUNT);
    localStorage.removeItem(STORAGE_KEY_COMPLETED);
    
    setGameState('landing');
    setCurrentLevel(0);
    setTotalDiscount(0);
    setUserData(null);
  };

  const shouldPlayMusic = gameState !== 'splash' && gameState !== 'loading';
  const t = TRANSLATIONS[language];

  return (
    <main 
      className={`font-sans text-white antialiased min-h-screen bg-cutscene-bg selection:bg-cutscene-blue selection:text-slate-900 ${language === 'ar' ? 'font-ar' : ''}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <FilmGrain />
      
      {/* Global Sound Controller */}
      <SoundController playBgMusic={shouldPlayMusic} />

      {gameState === 'splash' && (
        <AppLoader onComplete={handleSplashComplete} text={t.loading} />
      )}

      {gameState === 'landing' && (
        <LandingScreen 
          onStart={handleStart} 
          onLeaderboard={handleShowLeaderboard}
          t={t} 
          currentLang={language}
          onToggleLanguage={toggleLanguage}
        />
      )}

      {gameState === 'leaderboard' && (
        <LeaderboardScreen 
          onBack={handleBackToLanding}
          t={t}
          lang={language}
        />
      )}

      {gameState === 'registration' && (
        <RegistrationScreen 
          onRegister={handleRegistrationComplete} 
          onBack={handleBackToLanding}
          t={t}
          lang={language}
        />
      )}

      {gameState === 'intro' && (
        <IntroScreen onEnter={handleEnter} t={t} />
      )}

      {gameState === 'loading' && (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-cutscene-blue" size={40} />
          <p className="uppercase tracking-widest text-xs animate-pulse">{t.loading}...</p>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <QuizScreen 
          questions={questions}
          currentLevel={currentLevel}
          totalDiscount={totalDiscount}
          onAnswer={handleAnswer}
          t={t}
          lang={language}
        />
      )}

      {gameState === 'result' && (
        <ResultScreen 
          totalDiscount={totalDiscount}
          userData={userData}
          onRestart={handleRestart}
          onHome={handleRestart} // CRITICAL CHANGE: Calls reset instead of just changing view
          t={t}
          lang={language}
        />
      )}
    </main>
  );
};

export default App;