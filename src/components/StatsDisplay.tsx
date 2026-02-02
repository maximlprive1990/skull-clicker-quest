import { DollarSign, Zap, Star, Skull } from 'lucide-react';

interface StatsDisplayProps {
  money: number;
  level: number;
  deadPoints: number;
  totalClicks: number;
  clickMultiplier: number;
}

export const StatsDisplay = ({ money, level, deadPoints, totalClicks, clickMultiplier }: StatsDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      <div className="bg-gradient-card rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-neon-gold" />
          <span className="text-xs text-muted-foreground uppercase">CAD</span>
        </div>
        <p className="text-xl font-bold text-neon-gold mt-1">
          ${money.toFixed(4)}
        </p>
      </div>
      
      <div className="bg-gradient-card rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-neon-purple" />
          <span className="text-xs text-muted-foreground uppercase">Niveau</span>
        </div>
        <p className="text-xl font-bold text-neon-purple mt-1">
          {level}
        </p>
      </div>
      
      <div className="bg-gradient-card rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-neon-red" />
          <span className="text-xs text-muted-foreground uppercase">Dead Pts</span>
        </div>
        <p className="text-xl font-bold text-neon-red mt-1">
          {deadPoints}
        </p>
      </div>
      
      <div className="bg-gradient-card rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-neon-green" />
          <span className="text-xs text-muted-foreground uppercase">Multi</span>
        </div>
        <p className="text-xl font-bold text-neon-green mt-1">
          x{clickMultiplier}
        </p>
      </div>
    </div>
  );
};
