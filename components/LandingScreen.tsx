import React from 'react';
import Button from './Button';
import { Play, Globe, Trophy } from 'lucide-react';
import { Language } from '../types';

interface LandingScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
  t: any;
  currentLang: Language;
  onToggleLanguage: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onLeaderboard, t, currentLang, onToggleLanguage }) => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-end pb-12 px-6 overflow-hidden">
      {/* 
        ---------------------------------------------------------------------------
        BACKGROUND IMAGE CONFIGURATION
        ---------------------------------------------------------------------------
      */}
      
      <div className="absolute inset-0 z-0">
        {/* The Main Background Image */}
        <img 
          src="https://drive.google.com/thumbnail?id=1v_24zYK8DFGsgtp4S1M5ybtiEIgrHNtp&sz=w1000" 
          onError={(e) => {
            // Fallback: Dark Cinematic Forest (Stranger Things Vibe)
            e.currentTarget.src = "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2576&auto=format&fit=crop";
          }}
          referrerPolicy="no-referrer"
          alt="Stranger Things Background" 
          className="h-full w-full object-cover opacity-90 scale-105 animate-[pulse-slow_10s_infinite]"
        />
        
        {/* Cinematic Gradient Overlays for Text Readability - Made Darker */}
        <div className="absolute inset-0 bg-gradient-to-t from-cutscene-bg via-cutscene-bg/80 to-black/40" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
      </div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in">
        <button 
          onClick={onToggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all group shadow-lg"
        >
          <Globe size={14} className="text-cutscene-blue group-hover:rotate-12 transition-transform" />
          <span className={`text-[10px] font-bold tracking-widest uppercase ${currentLang === 'ar' ? 'font-sans' : 'font-display'}`}>
            {currentLang === 'en' ? 'العربية' : 'ENGLISH'}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full animate-fade-in space-y-4">
        
        {/* Logo Section */}
        <div className="mb-2">
            <h1 className="text-7xl font-sans italic font-extrabold tracking-tighter text-cutscene-blue drop-shadow-[0_0_25px_rgba(125,211,252,0.6)]">
                cut<span className="text-white inline-block transform -rotate-12 mx-1">/</span>scene
            </h1>
        </div>
        
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl font-display uppercase tracking-widest text-white drop-shadow-lg">
              {t.tagline1}
            </h2>
            <p className="text-cutscene-blue text-lg font-display uppercase tracking-widest drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
              {t.tagline2}
            </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
            <Button onClick={onStart} fullWidth className="shadow-2xl border border-white/10">
               {t.startBtn} <Play size={16} fill="currentColor" />
            </Button>
            
            <Button onClick={onLeaderboard} variant="outline" fullWidth className="border-white/20 text-xs py-3">
               <Trophy size={14} className="text-yellow-400" /> {t.leaderboardBtn}
            </Button>
        </div>
        
        <p className="text-[10px] text-slate-400 uppercase tracking-widest max-w-xs leading-relaxed opacity-80 drop-shadow-md mt-6">
          {t.quote}
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;