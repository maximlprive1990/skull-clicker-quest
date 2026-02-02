import { Skull } from 'lucide-react';

interface SkullButtonProps {
  onClick: () => void;
  isClicking: boolean;
  disabled: boolean;
}

export const SkullButton = ({ onClick, isClicking, disabled }: SkullButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-48 h-48 rounded-full 
        bg-gradient-to-b from-skull-bone to-muted
        border-4 border-neon-green
        shadow-neon-green
        transition-all duration-150
        hover:scale-105
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${isClicking ? 'animate-click-burst' : 'animate-float'}
        group
      `}
    >
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-b from-background/20 to-transparent" />
      
      {/* Skull icon */}
      <Skull 
        className={`
          w-28 h-28 mx-auto
          text-background
          drop-shadow-lg
          transition-all duration-150
          group-hover:text-neon-green
          ${isClicking ? 'scale-110' : ''}
        `}
      />
      
      {/* Pulse rings */}
      <div className={`
        absolute inset-0 rounded-full border-2 border-neon-green/50
        ${isClicking ? 'animate-ping' : ''}
      `} />
    </button>
  );
};
