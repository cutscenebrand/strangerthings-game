import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { UserData, Language } from '../types';
import { checkPhoneUnique, registerUser } from '../services/db';

interface RegistrationScreenProps {
  onRegister: (data: UserData) => void;
  onBack: () => void;
  t: any;
  lang: Language;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onBack, t, lang }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Spotlight Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        
        setSpotlight({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate format (11 digits)
    const phoneRegex = /^\d{11}$/;
    if (!name.trim()) {
      setError(lang === 'ar' ? "الاسم مطلوب" : "Name is required.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      setError(lang === 'ar' ? "يجب أن يكون الهاتف 11 رقماً" : "Phone number must be exactly 11 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Check Database for Uniqueness
      const isUnique = await checkPhoneUnique(phone);
      
      if (!isUnique) {
        setError(lang === 'ar' ? "هذا الرقم مسجل مسبقاً" : "This number is already registered.");
        setIsSubmitting(false);
        return;
      }

      // 3. Register User in DB
      await registerUser(name, phone);

      // Success - Proceed to Intro
      onRegister({ name, phone });
    } catch (err) {
      console.error(err);
      setError(lang === 'ar' ? "خطأ في الاتصال بقاعدة البيانات" : "Connection error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div 
        ref={containerRef}
        className="relative h-screen w-full flex flex-col items-center justify-center px-8 bg-cutscene-bg overflow-hidden"
    >
      {/* Dynamic Interrogation Spotlight Background */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60"
        style={{
            background: `radial-gradient(circle 300px at ${spotlight.x}% ${spotlight.y}%, rgba(30, 41, 59, 0.4), #0f172a 100%)`
        }}
      ></div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest mb-2 drop-shadow-md">
            {t.identifyTitle}
          </h2>
          <p className="text-slate-400 text-sm font-light">
            {t.identifyDesc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cutscene-blue font-bold block text-left rtl:text-right">{t.nameLabel}</label>
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                  <User size={18} />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-white/5 border border-white/10 rounded p-3 text-white placeholder-slate-600 focus:outline-none focus:border-cutscene-blue focus:bg-white/10 transition-all font-sans ${lang === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'}`}
                placeholder="Mike Wheeler"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cutscene-blue font-bold block text-left rtl:text-right">{t.phoneLabel}</label>
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                  <Phone size={18} />
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => {
                  // Only allow numbers
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 11) setPhone(val);
                }}
                className={`w-full bg-white/5 border border-white/10 rounded p-3 text-white placeholder-slate-600 focus:outline-none focus:border-cutscene-blue focus:bg-white/10 transition-all font-mono tracking-wider ${lang === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'}`}
                placeholder="01xxxxxxxxx"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-right rtl:text-left" dir="ltr">{phone.length}/11</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded border border-red-900/50 animate-pulse justify-center">
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase">{error}</span>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Button 
              type="submit" 
              fullWidth 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin" size={16} /> {t.verifying}
                </span>
              ) : t.registerBtn}
            </Button>
            
            <button 
              type="button" 
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full text-xs text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              {t.abortBtn}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;