import React, { useEffect, useState } from 'react';
import Button from './Button';
import { ArrowLeft, ArrowRight, Trophy, Medal, Loader2 } from 'lucide-react';
import { LeaderboardEntry, Language } from '../types';
import { getLeaderboard } from '../services/db';

interface LeaderboardScreenProps {
  onBack: () => void;
  t: any;
  lang: Language;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack, t, lang }) => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLeaderboard();
        setData(result);
      } catch (e) {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse" />;
    if (index === 1) return <Medal size={18} className="text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.4)]" />;
    if (index === 2) return <Medal size={18} className="text-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.4)]" />;
    return <span className="font-mono text-slate-500">#{index + 1}</span>;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start px-6 pt-12 pb-6 bg-cutscene-bg overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md flex flex-col h-full animate-fade-in space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3">
               <Trophy size={24} className="text-cutscene-blue" />
               {t.leaderboardTitle}
               <Trophy size={24} className="text-cutscene-blue" />
            </h2>
            <div className="h-0.5 w-16 bg-cutscene-blue mx-auto opacity-50"></div>
        </div>

        {/* List Content */}
        <div className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm relative">
            
            {/* Table Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <div className="w-10 text-center">{t.rank}</div>
                <div className="flex-1 text-left rtl:text-right px-4">{t.agent}</div>
                <div className="w-20 text-right rtl:text-left">{t.clearance}</div>
            </div>

            {/* List Body */}
            <div className="overflow-y-auto max-h-[60vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="animate-spin text-cutscene-blue" size={32} />
                        <span className="text-xs uppercase tracking-widest text-slate-500">{t.loading}...</span>
                    </div>
                ) : data.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {data.map((entry, idx) => (
                            <div 
                                key={idx} 
                                className={`flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''}`}
                            >
                                <div className="w-10 flex justify-center">
                                    {getRankIcon(idx)}
                                </div>
                                <div className="flex-1 text-left rtl:text-right px-4">
                                    <span className={`font-display tracking-wide font-bold truncate block max-w-[150px] ${idx < 3 ? 'text-white' : 'text-slate-400'}`}>
                                        {entry.name}
                                    </span>
                                </div>
                                <div className="w-20 text-right rtl:text-left font-mono text-cutscene-blue font-bold">
                                    {entry.discount}%
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-xs uppercase tracking-widest">
                        {t.noRecords}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Button */}
        <Button onClick={onBack} variant="outline" fullWidth className="border-white/10 hover:bg-white/5 mt-auto">
            <span className="flex items-center gap-2 justify-center">
                <ArrowLeft size={14} className="ltr:block rtl:hidden" />
                <ArrowRight size={14} className="rtl:block ltr:hidden" />
                {t.backBtn} 
            </span>
        </Button>

      </div>
    </div>
  );
};

export default LeaderboardScreen;