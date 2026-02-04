import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Celebration from './Celebration';
import { Check, Lock, Sparkles, Send, ExternalLink, Home } from 'lucide-react';
import { UserData, Language } from '../types';
import { playSound } from './SoundController';

interface ResultScreenProps {
  totalDiscount: number;
  userData: UserData | null;
  onRestart: () => void;
  onHome: () => void;
  t: any;
  lang: Language;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ totalDiscount, userData, onRestart, onHome, t, lang }) => {
  const [copied, setCopied] = useState(false);
  const code = `SCENE${2024 + totalDiscount}`;
  const isWinner = totalDiscount > 0;
  // Adjusted for new Max Reward of 25% - High score is now > 20
  const isHighScore = totalDiscount >= 20; 
  
  const ticketRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isWinner) {
        const timer = setTimeout(() => {
            playSound('win');
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [isWinner]);

  // Gyroscope Effect Logic
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!ticketRef.current) return;
      
      // Beta: Front/Back tilt (-180 to 180). We expect phone held at ~45deg usually.
      // Gamma: Left/Right tilt (-90 to 90).
      
      const y = event.gamma || 0; 
      const x = event.beta || 0;

      // Calculate rotation based on tilt
      // We limit the range to avoid flipping the card too much
      const rotateY = Math.min(Math.max(y, -45), 45) / 2; 
      // For X, we assume holding angle of 45deg is "neutral" (0 rotation)
      const rotateX = Math.min(Math.max(x - 45, -45), 45) / 2;

      setRotation({ x: -rotateX, y: -rotateY });
      
      // Update glare based on orientation
      // Map -25..25 deg to 0..100%
      const glareX = 50 + (y * 2); 
      const glareY = 50 + ((x - 45) * 2);
      
      setGlarePosition({ x: glareX, y: glareY });
    };

    // Check if permission is needed (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && (DeviceOrientationEvent as any).requestPermission) {
        // Permission is usually requested via user interaction button, but we can try adding listener
        // If it fails, we just fall back to mouse move.
        // For this context, we just add the listener.
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!ticketRef.current) return;

    const rect = ticketRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    
    const xRot = (0.5 - yPct) * 20; 
    const yRot = (xPct - 0.5) * 20; 

    setRotation({ x: xRot, y: yRot });
    setGlarePosition({ x: xPct * 100, y: yPct * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleClaim = () => {
    playSound('click');
    const message = `CLAIM ORDER DISCOUNT
Name: ${userData?.name || 'N/A'}
Phone: ${userData?.phone || 'N/A'}
Code: ${code}
Discount: ${totalDiscount}%`;

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => {
        window.open('https://www.tiktok.com/@cutscene.brand', '_blank');
      }, 1500);
    }).catch(err => {
      console.error("Failed to copy", err);
      window.open('https://www.tiktok.com/@cutscene.brand', '_blank');
    });
  };

  const getPerformanceStats = (discount: number) => {
      // Adjusted stats for new max 25 scale (based on 8 questions)
      if (discount >= 25) return { count: 8 };
      if (discount >= 21) return { count: 7 };
      if (discount >= 17) return { count: 6 };
      if (discount >= 13) return { count: 5 };
      if (discount >= 10) return { count: 4 };
      if (discount >= 7) return { count: 3 };
      if (discount >= 4) return { count: 2 };
      if (discount >= 2) return { count: 1 };
      return { count: 0 };
  };

  const stats = getPerformanceStats(totalDiscount);

  const getBackgroundClass = () => {
    if (!isWinner) return 'from-red-950 via-black to-red-900';
    if (isHighScore) return 'from-indigo-950 via-purple-900 to-blue-900'; 
    return 'from-slate-950 via-blue-950 to-slate-900'; 
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden pt-8 pb-8 bg-gradient-to-br ${getBackgroundClass()}`}>
      
      {isWinner && <Celebration />}
      <div className={`absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]`}></div>
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full blur-[120px] opacity-10 pointer-events-none animate-pulse ${isWinner ? 'bg-blue-400' : 'bg-red-700'}`}></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-slide-up space-y-6">
        
        <div 
            className="relative w-full perspective-1000 mt-4 cursor-pointer"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchEnd={handleMouseLeave}
        >
            <div 
                ref={ticketRef}
                className="relative preserve-3d transition-transform duration-200 ease-out"
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <div className={`absolute -inset-[1px] rounded-3xl blur-sm opacity-60 transition-all duration-1000 ${isWinner ? 'bg-gradient-to-b from-cyan-400 to-indigo-600' : 'bg-red-900'}`} style={{ transform: 'translateZ(-10px)' }}></div>
                
                <div className="relative bg-[#0b0f19]/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/5 backface-hidden">
                    
                    <div 
                        className="absolute inset-0 pointer-events-none mix-blend-overlay z-50 opacity-30 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.6) 0%, transparent 70%)`
                        }}
                    ></div>

                    <div className="relative h-28 flex items-center justify-center overflow-hidden bg-black/40">
                        <div className="relative z-10 w-36 p-4 flex items-center justify-center" style={{ transform: 'translateZ(20px)' }}>
                             <img 
                                src="https://drive.google.com/thumbnail?id=1I4ILZoprhawztWIkhMKpEosaRrRHe0x_&sz=w1000" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                alt="Cutscene Logo" 
                                className={`w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isWinner ? 'animate-pulse' : 'grayscale opacity-50'}`}
                             />
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between px-2 -my-3 z-20">
                        <div className="w-5 h-5 rounded-full bg-[#0f172a]"></div>
                        <div className="flex-1 border-t border-dashed border-slate-800 mx-2"></div>
                        <div className="w-5 h-5 rounded-full bg-[#0f172a]"></div>
                    </div>

                    <div className="p-6 pt-8 flex flex-col items-center text-center space-y-4" style={{ transform: 'translateZ(10px)' }}>
                        
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{t.authorizedAgent}</p>
                            <p className="text-lg text-white font-display tracking-wide font-bold">{userData?.name || 'Unknown'}</p>
                        </div>

                        {isWinner ? (
                            <>
                                <div className="animate-fade-in">
                                    <p className="text-white/80 font-medium text-xs">
                                        {lang === 'ar' ? (
                                           <>أجبت على <span className="text-cyan-400 font-bold text-base mx-1">{stats.count}</span> أسئلة.</>
                                        ) : (
                                           <>You answered <span className="text-cyan-400 font-bold text-base mx-1">{stats.count}</span> questions correctly.</>
                                        )}
                                    </p>
                                </div>

                                <div className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-4 relative overflow-hidden">
                                    <p className="text-[11px] text-cyan-400 uppercase tracking-[0.2em] mb-1 font-bold opacity-80">{t.totalDiscount}</p>
                                    <div className="text-7xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] leading-none">
                                        {totalDiscount}%
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full bg-red-900/5 border border-red-500/10 rounded-2xl p-6">
                                <Lock size={28} className="text-red-500/50 mx-auto mb-2" />
                                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{t.accessDenied}</p>
                            </div>
                        )}
                    </div>

                    {isWinner && (
                        <div className="bg-white/5 p-4 border-t border-white/5 text-left rtl:text-right space-y-2">
                            <p className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-2">
                                <Sparkles size={8} /> {t.instructions}
                            </p>
                            <ol className="text-[9px] text-slate-400 space-y-1 font-sans list-decimal list-inside">
                                <li>{t.step1}</li>
                                <li>{t.step2}</li>
                                <li>{t.step3}</li>
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="w-full space-y-3 pt-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {isWinner ? (
                <Button 
                    fullWidth 
                    onClick={handleClaim} 
                    disabled={copied} 
                    className={`shadow-xl border border-white/5 ${copied ? 'bg-green-600' : 'bg-cyan-600'}`}
                >
                    {copied ? (
                        <span className="flex items-center gap-2 justify-center">
                            <Check size={16}/> <span>{t.openingTiktok}</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 justify-center">
                            <Send size={16} className="rotate-45" /> <span>{t.claimReward}</span>
                        </span>
                    )}
                </Button>
            ) : (
                <Button fullWidth onClick={onRestart} variant="outline" className="border-red-500/20 text-red-100">
                    <span className="flex items-center gap-2"> {t.tryAgain} </span>
                </Button>
            )}
            
            {/* New Home Button - RESETS THE GAME */}
            <Button 
                variant="outline" 
                fullWidth 
                onClick={onHome} 
                className="border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
                <span className="flex items-center gap-2 justify-center">
                     <Home size={16} /> {t.homeBtn}
                </span>
            </Button>
        </div>

      </div>
    </div>
  );
};

export default ResultScreen;