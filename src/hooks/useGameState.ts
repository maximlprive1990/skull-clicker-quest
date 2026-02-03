import { useState, useEffect, useCallback } from 'react';

export interface GameState {
  money: number;
  energy: number;
  maxEnergy: number;
  experience: number;
  level: number;
  deadPoints: number;
  totalClicks: number;
  
  // Upgrades
  clickMultiplier: number;
  autoClickReward: number;
  autoClickEndTime: number | null;
  energyRegenRate: number;
  
  // Special upgrades (lifetime)
  lifetimeRewardMultiplier: number;
  hasSpecialAutoClick: boolean;
  specialAutoClickEndTime: number | null;
  
  // Upgrade purchase counts (for scaling costs)
  upgradeCounts: Record<string, number>;
}

const initialState: GameState = {
  money: 0,
  energy: 500,
  maxEnergy: 500,
  experience: 0,
  level: 1,
  deadPoints: 0,
  totalClicks: 0,
  clickMultiplier: 1,
  autoClickReward: 0,
  autoClickEndTime: null,
  energyRegenRate: 1,
  lifetimeRewardMultiplier: 1,
  hasSpecialAutoClick: false,
  specialAutoClickEndTime: null,
  upgradeCounts: {},
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('skullClickerState');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  });

  const [isClicking, setIsClicking] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState<Array<{ id: number; value: number; type: 'money' | 'xp' | 'dead' }>>([]);

  // Save state
  useEffect(() => {
    localStorage.setItem('skullClickerState', JSON.stringify(state));
  }, [state]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        energy: Math.min(prev.energy + prev.energyRegenRate, prev.maxEnergy)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto click
  useEffect(() => {
    if (!state.autoClickEndTime || Date.now() > state.autoClickEndTime) return;
    
    const interval = setInterval(() => {
      if (state.energy > 0) {
        performClick(true);
      }
    }, 1000 / state.autoClickReward);
    
    return () => clearInterval(interval);
  }, [state.autoClickEndTime, state.autoClickReward, state.energy]);

  // Special auto click (x7/sec)
  useEffect(() => {
    if (!state.specialAutoClickEndTime || Date.now() > state.specialAutoClickEndTime) return;
    
    const interval = setInterval(() => {
      if (state.energy > 0) {
        performClick(true);
      }
    }, 1000 / 7);
    
    return () => clearInterval(interval);
  }, [state.specialAutoClickEndTime, state.energy]);

  // Check expired auto-clicks
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const updates: Partial<GameState> = {};
        if (prev.autoClickEndTime && Date.now() > prev.autoClickEndTime) {
          updates.autoClickEndTime = null;
          updates.autoClickReward = 0;
        }
        if (prev.specialAutoClickEndTime && Date.now() > prev.specialAutoClickEndTime) {
          updates.specialAutoClickEndTime = null;
          updates.hasSpecialAutoClick = false;
        }
        return { ...prev, ...updates };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addFloatingReward = useCallback((value: number, type: 'money' | 'xp' | 'dead') => {
    const id = Date.now() + Math.random();
    setFloatingRewards(prev => [...prev, { id, value, type }]);
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== id));
    }, 1000);
  }, []);

  const performClick = useCallback((isAuto = false) => {
    setState(prev => {
      if (prev.energy <= 0) return prev;

      // Random rewards (reduced significantly for longer gameplay)
      const baseMoney = Math.random() * (0.0005 - 0.00001) + 0.00001;
      const baseXp = Math.random() * (2.5 - 1) + 1;
      
      const moneyGain = baseMoney * prev.clickMultiplier * prev.lifetimeRewardMultiplier;
      const xpGain = baseXp;
      
      // Dead points (1 per 10 clicks average)
      const deadPointGain = Math.random() < 0.1 ? 1 : 0;
      
      const newXp = prev.experience + xpGain;
      const xpToLevel = prev.level * 100;
      const levelUp = newXp >= xpToLevel;
      
      if (!isAuto) {
        addFloatingReward(moneyGain, 'money');
        if (deadPointGain > 0) {
          setTimeout(() => addFloatingReward(deadPointGain, 'dead'), 100);
        }
      }

      return {
        ...prev,
        money: prev.money + moneyGain,
        energy: prev.energy - 1,
        experience: levelUp ? newXp - xpToLevel : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        deadPoints: prev.deadPoints + deadPointGain,
        totalClicks: prev.totalClicks + 1,
      };
    });

    if (!isAuto) {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 150);
    }
  }, [addFloatingReward]);

  const buyUpgrade = useCallback((type: string, cost: number, currency: 'money' | 'dead') => {
    setState(prev => {
      // Calculate actual cost based on purchase count
      const purchaseCount = prev.upgradeCounts[type] || 0;
      const actualCost = cost * Math.pow(1.5, purchaseCount); // Cost increases by 50% each purchase
      
      const balance = currency === 'money' ? prev.money : prev.deadPoints;
      if (balance < actualCost) return prev;

      const updates: Partial<GameState> = {
        [currency === 'money' ? 'money' : 'deadPoints']: balance - actualCost,
        upgradeCounts: { ...prev.upgradeCounts, [type]: purchaseCount + 1 }
      };

      switch (type) {
        case 'x2click':
          updates.clickMultiplier = prev.clickMultiplier * 2;
          break;
        case 'maxEnergy100':
          updates.maxEnergy = prev.maxEnergy + 100;
          break;
        case 'maxEnergy250':
          updates.maxEnergy = prev.maxEnergy + 250;
          break;
        case 'maxEnergy500':
          updates.maxEnergy = prev.maxEnergy + 500;
          break;
        case 'autoClick1':
        case 'autoClick2':
        case 'autoClick3':
        case 'autoClick6':
        case 'autoClick9':
          const rates: Record<string, number> = { autoClick1: 1, autoClick2: 2, autoClick3: 3, autoClick6: 6, autoClick9: 9 };
          updates.autoClickReward = rates[type];
          updates.autoClickEndTime = Date.now() + 24 * 60 * 60 * 1000;
          break;
        case 'x5lifetime':
          updates.lifetimeRewardMultiplier = prev.lifetimeRewardMultiplier * 5;
          break;
        case 'fastRegen':
          updates.energyRegenRate = prev.energyRegenRate * 2;
          break;
        case 'x750click':
          updates.clickMultiplier = prev.clickMultiplier * 750;
          break;
        case 'specialAutoClick':
          updates.hasSpecialAutoClick = true;
          updates.specialAutoClickEndTime = Date.now() + 24 * 60 * 60 * 1000;
          break;
      }

      return { ...prev, ...updates };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
    localStorage.removeItem('skullClickerState');
  }, []);

  return {
    state,
    isClicking,
    floatingRewards,
    performClick,
    buyUpgrade,
    resetGame,
  };
};
