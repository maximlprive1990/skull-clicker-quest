interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
  type: 'energy' | 'xp' | 'dead';
  showValue?: boolean;
}

export const ProgressBar = ({ current, max, label, type, showValue = true }: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const colors = {
    energy: 'from-game-energy to-blue-400',
    xp: 'from-game-xp to-purple-400',
    dead: 'from-game-dead to-red-400',
  };

  const glows = {
    energy: 'shadow-[0_0_10px_hsl(var(--energy-bar)/0.5)]',
    xp: 'shadow-[0_0_10px_hsl(var(--xp-bar)/0.5)]',
    dead: 'shadow-[0_0_10px_hsl(var(--dead-points)/0.5)]',
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-game uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {showValue && (
          <span className="text-xs font-game font-bold text-foreground">
            {Math.floor(current)} / {max}
          </span>
        )}
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
        <div
          className={`h-full bg-gradient-to-r ${colors[type]} ${glows[type]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
