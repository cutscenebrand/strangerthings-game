import React from 'react';

const FilmGrain: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full overflow-hidden select-none">
      
      {/* 1. Base Noise / Film Grain - Reduced opacity from 0.08 to 0.04 */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg className="h-full w-full">
            <filter id="noise">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
            />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 2. CRT Scanlines (The 80s TV Effect) - Significantly reduced darkness */}
      {/* Reduced the black line opacity from 0.25 to 0.05 to let more light through */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[51] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>

      {/* 3. Vignette (Dark Corners) - Reduced opacity from 0.6 to 0.2 and widened the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_65%,rgba(0,0,0,0.2)_100%)] z-[52]"></div>
    </div>
  );
};

export default FilmGrain;