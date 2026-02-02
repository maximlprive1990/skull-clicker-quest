import { SkullButton } from '@/components/SkullButton';
import { ProgressBar } from '@/components/ProgressBar';
import { StatsDisplay } from '@/components/StatsDisplay';
import { UpgradeShop } from '@/components/UpgradeShop';
import { FloatingReward } from '@/components/FloatingReward';
import { AutoClickTimer } from '@/components/AutoClickTimer';
import { useGameState } from '@/hooks/useGameState';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const { state, isClicking, floatingRewards, performClick, buyUpgrade, resetGame } = useGameState();

  const xpToLevel = state.level * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4 overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-display text-5xl md:text-6xl text-neon-green tracking-wider mb-2">
          Skull Clicker
        </h1>
        <p className="text-muted-foreground text-sm">Clique pour gagner des $CAD et des points Dead</p>
      </div>

      {/* Stats */}
      <StatsDisplay 
        money={state.money}
        level={state.level}
        deadPoints={state.deadPoints}
        totalClicks={state.totalClicks}
        clickMultiplier={state.clickMultiplier}
      />

      {/* Progress Bars */}
      <div className="w-full max-w-md space-y-3 my-6">
        <ProgressBar 
          current={state.energy} 
          max={state.maxEnergy} 
          label="Énergie" 
          type="energy" 
        />
        <ProgressBar 
          current={state.experience} 
          max={xpToLevel} 
          label={`XP (Niveau ${state.level})`} 
          type="xp" 
        />
      </div>

      {/* Auto Click Timer */}
      <AutoClickTimer 
        autoClickEndTime={state.autoClickEndTime}
        autoClickReward={state.autoClickReward}
        specialAutoClickEndTime={state.specialAutoClickEndTime}
      />

      {/* Skull Button */}
      <div className="relative my-8">
        <SkullButton 
          onClick={() => performClick(false)}
          isClicking={isClicking}
          disabled={state.energy <= 0}
        />
        <FloatingReward rewards={floatingRewards} />
      </div>

      {/* Energy Warning */}
      {state.energy <= 0 && (
        <div className="text-neon-red text-sm font-bold animate-pulse mb-4">
          ⚡ Énergie épuisée! Attends la régénération...
        </div>
      )}

      {/* Upgrade Shop */}
      <UpgradeShop state={state} onBuyUpgrade={buyUpgrade} />

      {/* Reset Button */}
      <button
        onClick={resetGame}
        className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Reset le jeu
      </button>

      {/* Footer */}
      <p className="mt-4 text-xs text-muted-foreground">
        Total clicks: {state.totalClicks.toLocaleString()}
      </p>
    </div>
  );
};

export default Index;
