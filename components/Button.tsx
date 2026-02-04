import React from 'react';
import { playSound } from './SoundController';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  
  const baseStyles = "relative px-8 py-4 uppercase font-display font-bold tracking-widest text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-cutscene-blue text-slate-900 hover:bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]",
    secondary: "bg-white text-slate-900 hover:bg-gray-200",
    outline: "border border-white/30 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (onClick) onClick(e);
  };

  return (
    <button 
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} 
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Cinematic Glint Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
    </button>
  );
};

export default Button;