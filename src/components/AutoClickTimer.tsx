import { Bot, Skull } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AutoClickTimerProps {
  autoClickEndTime: number | null;
  autoClickReward: number;
  specialAutoClickEndTime: number | null;
}

export const AutoClickTimer = ({ autoClickEndTime, autoClickReward, specialAutoClickEndTime }: AutoClickTimerProps) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (endTime: number) => {
    const remaining = Math.max(0, endTime - Date.now());
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const hasAutoClick = autoClickEndTime && Date.now() < autoClickEndTime;
  const hasSpecialAutoClick = specialAutoClickEndTime && Date.now() < specialAutoClickEndTime;

  if (!hasAutoClick && !hasSpecialAutoClick) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      {hasAutoClick && (
        <div className="flex items-center justify-between bg-neon-purple/20 border border-neon-purple/50 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-neon-purple animate-pulse" />
            <span className="text-sm text-neon-purple font-bold">Auto x{autoClickReward}/s</span>
          </div>
          <span className="text-sm font-mono text-foreground">{formatTime(autoClickEndTime)}</span>
        </div>
      )}
      
      {hasSpecialAutoClick && (
        <div className="flex items-center justify-between bg-neon-red/20 border border-neon-red/50 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-neon-red animate-pulse" />
            <span className="text-sm text-neon-red font-bold">Auto Spécial x7/s</span>
          </div>
          <span className="text-sm font-mono text-foreground">{formatTime(specialAutoClickEndTime)}</span>
        </div>
      )}
    </div>
  );
};
