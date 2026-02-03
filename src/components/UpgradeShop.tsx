import { Zap, Battery, Bot, Crown, Sparkles, Gauge, Skull } from 'lucide-react';
import { GameState } from '@/hooks/useGameState';

interface UpgradeShopProps {
  state: GameState;
  onBuyUpgrade: (type: string, cost: number, currency: 'money' | 'dead') => void;
}

interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currency: 'money' | 'dead';
  icon: React.ReactNode;
  special?: boolean;
}

export const UpgradeShop = ({ state, onBuyUpgrade }: UpgradeShopProps) => {
  const upgradeCounts = state.upgradeCounts || {};
  
  const getActualCost = (id: string, baseCost: number): number => {
    const purchaseCount = upgradeCounts[id] || 0;
    return baseCost * Math.pow(1.5, purchaseCount);
  };

  const basicUpgrades: UpgradeItem[] = [
    { id: 'x2click', name: 'Click x2', description: 'Double tes gains par click', baseCost: 0.50, currency: 'money', icon: <Zap className="w-5 h-5" /> },
    { id: 'maxEnergy100', name: '+100 Énergie', description: 'Augmente ton énergie max', baseCost: 0.25, currency: 'money', icon: <Battery className="w-5 h-5" /> },
    { id: 'maxEnergy250', name: '+250 Énergie', description: 'Augmente ton énergie max', baseCost: 0.75, currency: 'money', icon: <Battery className="w-5 h-5" /> },
    { id: 'maxEnergy500', name: '+500 Énergie', description: 'Augmente ton énergie max', baseCost: 1.50, currency: 'money', icon: <Battery className="w-5 h-5" /> },
  ];

  const autoClickUpgrades: UpgradeItem[] = [
    { id: 'autoClick1', name: 'Auto x1/s', description: '24h de clicks auto', baseCost: 0.10, currency: 'money', icon: <Bot className="w-5 h-5" /> },
    { id: 'autoClick2', name: 'Auto x2/s', description: '24h de clicks auto', baseCost: 0.25, currency: 'money', icon: <Bot className="w-5 h-5" /> },
    { id: 'autoClick3', name: 'Auto x3/s', description: '24h de clicks auto', baseCost: 0.50, currency: 'money', icon: <Bot className="w-5 h-5" /> },
    { id: 'autoClick6', name: 'Auto x6/s', description: '24h de clicks auto', baseCost: 1.00, currency: 'money', icon: <Bot className="w-5 h-5" /> },
    { id: 'autoClick9', name: 'Auto x9/s', description: '24h de clicks auto', baseCost: 2.00, currency: 'money', icon: <Bot className="w-5 h-5" /> },
  ];

  const specialUpgrades: UpgradeItem[] = [
    { id: 'x5lifetime', name: 'x5 Lifetime', description: 'x5 rewards permanent!', baseCost: 50, currency: 'dead', icon: <Crown className="w-5 h-5" />, special: true },
    { id: 'fastRegen', name: 'Regen Rapide', description: 'x2 régénération énergie', baseCost: 30, currency: 'dead', icon: <Sparkles className="w-5 h-5" />, special: true },
    { id: 'x750click', name: 'x750 Click', description: 'Multiplicateur massif!', baseCost: 100, currency: 'dead', icon: <Gauge className="w-5 h-5" />, special: true },
    { id: 'specialAutoClick', name: 'Auto x7/s 24h', description: 'Auto-click spécial', baseCost: 75, currency: 'dead', icon: <Skull className="w-5 h-5" />, special: true },
  ];

  const renderUpgrade = (upgrade: UpgradeItem) => {
    const actualCost = getActualCost(upgrade.id, upgrade.baseCost);
    const balance = upgrade.currency === 'money' ? state.money : state.deadPoints;
    const canAfford = balance >= actualCost;
    const currencySymbol = upgrade.currency === 'money' ? '$' : '💀';
    const purchaseCount = upgradeCounts[upgrade.id] || 0;

    return (
      <button
        key={upgrade.id}
        onClick={() => onBuyUpgrade(upgrade.id, upgrade.baseCost, upgrade.currency)}
        disabled={!canAfford}
        className={`
          w-full p-3 rounded-lg border transition-all duration-200
          ${upgrade.special 
            ? 'bg-gradient-to-br from-neon-red/20 to-background border-neon-red/50 hover:border-neon-red hover:shadow-neon-red' 
            : 'bg-gradient-card border-border hover:border-neon-green hover:shadow-neon-green'
          }
          ${canAfford ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
          text-left
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${upgrade.special ? 'bg-neon-red/20 text-neon-red' : 'bg-neon-green/20 text-neon-green'}`}>
            {upgrade.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-foreground truncate">{upgrade.name}</h4>
              {purchaseCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-neon-purple/20 text-neon-purple">
                  Lv.{purchaseCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{upgrade.description}</p>
            <p className={`text-sm font-bold mt-1 ${upgrade.special ? 'text-neon-red' : 'text-neon-gold'}`}>
              {currencySymbol}{actualCost < 0.01 ? actualCost.toFixed(5) : actualCost.toFixed(2)}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Upgrades Basiques
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {basicUpgrades.map(renderUpgrade)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-neon-purple uppercase tracking-wider mb-2 flex items-center gap-2">
          <Bot className="w-4 h-4" /> Auto-Click (24h)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {autoClickUpgrades.map(renderUpgrade)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-neon-red uppercase tracking-wider mb-2 flex items-center gap-2">
          <Skull className="w-4 h-4" /> Upgrades Spéciales (Dead Pts)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {specialUpgrades.map(renderUpgrade)}
        </div>
      </div>
    </div>
  );
};
