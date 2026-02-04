import React, { useEffect, useState } from 'react';

interface AppLoaderProps {
  onComplete: () => void;
  text?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ onComplete, text = "LOADING" }) => {
  const [animationStage, setAnimationStage] = useState<0 | 1 | 2>(0); 
  // 0: Loading (Slow Spin)
  // 1: Exiting (Fast Spin + Move Right + Scale)
  // 2: Fade Out (Container Opacity 0)

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // 1. Initial Load Duration
    const stage1Timer = setTimeout(() => {
      setAnimationStage(1); // Trigger Fast Spin + Move + Scale
    }, 2500);

    // 2. Start Fading Out Container shortly after movement starts
    const stage2Timer = setTimeout(() => {
      setAnimationStage(2); // Fade out the whole black screen
    }, 3000);

    // 3. Complete and Unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Dynamic Classes based on Stage
  const containerClasses = animationStage === 2 ? 'opacity-0' : 'opacity-100';
  
  // Wrapper for Movement (Translate + Scale)
  const movementClasses = animationStage >= 1 
    ? 'translate-x-[150%] scale-[8] opacity-0 duration-700 ease-in' // Exit: Move Right, Big Scale, Fade out self
    : 'translate-x-0 scale-100 opacity-100 duration-1000'; // Normal

  // Image for Rotation
  const spinClasses = animationStage >= 1
    ? 'animate-[spin_0.2s_linear_infinite]' // Super fast spin
    : 'animate-[spin_6s_linear_infinite]'; // Slow idle spin

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cutscene-bg transition-opacity duration-700 ${containerClasses} overflow-hidden`}>
      
      {/* Subtle Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-[#020617] opacity-80"></div>

      <div className={`relative z-10 flex flex-col items-center transition-all ${movementClasses}`}>
        
        {/* LOGO CONTAINER */}
        <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* The Logo Image */}
            {!imgError ? (
                <img 
                    src="https://drive.google.com/thumbnail?id=1I4ILZoprhawztWIkhMKpEosaRrRHe0x_&sz=w1000" 
                    alt="Logo" 
                    className={`relative w-full h-full object-contain drop-shadow-[0_0_25px_rgba(125,211,252,0.4)] ${spinClasses}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                />
            ) : (
                // Fallback SVG
                <div className={`relative w-32 h-32 ${spinClasses} opacity-80`}>
                     <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]">
                        <path d="M50 20 L80 35 L50 50 L20 35 Z" stroke="#7dd3fc" strokeWidth="2" fill="rgba(125,211,252,0.1)"/>
                        <path d="M50 40 L80 55 L50 70 L20 55 Z" stroke="#7dd3fc" strokeWidth="2" fill="rgba(125,211,252,0.1)"/>
                        <path d="M50 60 L80 75 L50 90 L20 75 Z" stroke="#7dd3fc" strokeWidth="2" fill="rgba(125,211,252,0.1)"/>
                     </svg>
                </div>
            )}
        </div>
      </div>

      {/* Text remains centered and fades out separately or with container */}
      <div className={`absolute bottom-20 flex flex-col items-center transition-opacity duration-300 ${animationStage >= 1 ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-xl font-display font-bold text-white tracking-[0.4em] animate-pulse">
                {text}
            </h1>
            <div className="text-cutscene-blue text-2xl font-bold tracking-widest mt-1 animate-pulse leading-none">
                ...
            </div>
      </div>
    </div>
  );
};

export default AppLoader;