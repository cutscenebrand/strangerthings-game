import React from 'react';
import Button from './Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
  t: any;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter, t }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center px-8 bg-cutscene-bg overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-3">
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-[0.2em] leading-tight">
            {t.enterTitle.split(' ').map((word: string, i: number) => <span key={i} className="block">{word}</span>)}
          </h2>
          <div className="h-0.5 w-8 bg-cutscene-blue mx-auto opacity-50"></div>
        </div>

        <p className="text-slate-400 text-sm font-light leading-relaxed">
           {t.enterDesc}
        </p>

        <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest text-slate-500 py-2">
            <div className="border border-white/5 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <span className="block text-2xl text-white font-display font-bold mb-1">8</span>
                {t.levels}
            </div>
            <div className="border border-white/5 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <span className="block text-2xl text-cutscene-blue font-display font-bold mb-1">25%</span>
                {t.maxReward}
            </div>
        </div>

        <Button onClick={onEnter} variant="outline" fullWidth className="border-white/10 hover:bg-white/5">
           <span className="flex items-center gap-2 justify-center">
             {t.enterBtn} 
             <ArrowRight size={14} className="rtl:hidden" />
             <ArrowLeft size={14} className="ltr:hidden" />
           </span>
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;