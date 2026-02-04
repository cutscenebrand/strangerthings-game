import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  className = "",
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    indexRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        // Add next character
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        // Finished
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-cutscene-blue align-middle"></span>
    </span>
  );
};

export default TypewriterText;