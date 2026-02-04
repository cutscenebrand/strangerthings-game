import React from 'react';

const Celebration: React.FC = () => {
  // Generate more particles for an explosion effect
  const particles = Array.from({ length: 60 });
  
  // Colors: Blue, Gold, Red (Stranger Things / Winner Palette)
  const colors = ['#7dd3fc', '#fbbf24', '#ef4444', '#ffffff'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => {
        const left = 50; // Start from center horizontally
        const bottom = 50; // Start from center vertically
        
        // Random spread direction
        const angle = Math.random() * 360;
        const distance = 50 + Math.random() * 100; // Spread distance
        const x = Math.cos(angle * (Math.PI / 180)) * distance;
        const y = Math.sin(angle * (Math.PI / 180)) * distance;

        const duration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const size = 3 + Math.random() * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${bottom}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              opacity: 0,
              transform: 'translate(-50%, -50%)',
              animation: `explode ${duration}s cubic-bezier(0, 0, 0.2, 1) forwards`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes explode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}vw), calc(-50% + ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}vh)) scale(1);
          }
        }
      `}</style>
      
      {/* Cinematic Spotlight Beams */}
      <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-blue-500/20 to-transparent rotate-[15deg] blur-2xl animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-blue-500/20 to-transparent rotate-[-15deg] blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default Celebration;