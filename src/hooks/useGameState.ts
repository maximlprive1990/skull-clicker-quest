import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface MinerOwned {
  id: string;
  count: number;
}

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

  // Miners
  miners: MinerOwned[];
}

export interface MinerDefinition {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  deadSpotPerSec: number;
  image: string;
}

export const MINER_DEFINITIONS: MinerDefinition[] = [
  { id: 'miner1', name: 'Squelette Piocheur', description: 'Un squelette basique avec une pioche rouillée.', baseCost: 50, deadSpotPerSec: 0.000001, image: 'miner-1' },
  { id: 'miner2', name: 'Mineur de Cristal', description: 'Équipé d\'un casque et d\'une pioche en fer.', baseCost: 500, deadSpotPerSec: 0.00005, image: 'miner-2' },
  { id: 'miner3', name: 'Extracteur Doré', description: 'Pioche dorée, mine des cristaux violets rares.', baseCost: 5000, deadSpotPerSec: 0.001, image: 'miner-3' },
  { id: 'miner4', name: 'Foreur Infernal', description: 'Foreuse mécanique alimentée par l\'énergie sombre.', baseCost: 50000, deadSpotPerSec: 0.01, image: 'miner-4' },
  { id: 'miner5', name: 'Démon des Mines', description: 'Un démon qui fore dans les profondeurs de la lave.', baseCost: 500000, deadSpotPerSec: 0.1, image: 'miner-5' },
  { id: 'miner6', name: 'Faucheur Suprême', description: 'Le maître absolu des mines. Puissance légendaire.', baseCost: 5000000, deadSpotPerSec: 1, image: 'miner-6' },
];

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
  miners: [],
};

// Debounce function for saving
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const useGameState = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('skullClickerState');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isClicking, setIsClicking] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState<Array<{ id: number; value: number; type: 'money' | 'xp' | 'dead' }>>([]);

  // Load from database when user logs in
  useEffect(() => {
    const loadFromDatabase = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setIsLoaded(true);
        return;
      }

      if (data) {
        // Merge local state upgrades that aren't in DB
        const localState = localStorage.getItem('skullClickerState');
        const localUpgrades = localState ? JSON.parse(localState).upgradeCounts || {} : {};
        
        setState(prev => ({
          ...prev,
          money: data.money || 0,
          energy: data.energy || 100,
          maxEnergy: data.max_energy || 100,
          experience: data.experience || 0,
          level: data.level || 1,
          deadPoints: data.dead_points || 0,
          totalClicks: data.total_clicks || 0,
          clickMultiplier: data.click_multiplier || 1,
          autoClickReward: data.auto_click_reward || 0,
          autoClickEndTime: data.auto_click_end_time || null,
          energyRegenRate: data.energy_regen || 1,
          lifetimeRewardMultiplier: 1,
          hasSpecialAutoClick: !!data.special_auto_click_end_time,
          specialAutoClickEndTime: data.special_auto_click_end_time || null,
          upgradeCounts: localUpgrades,
          miners: prev.miners, // keep local miners
        }));
      }
      setIsLoaded(true);
    };

    loadFromDatabase();
  }, [user]);

  // Save to database (debounced)
  const saveToDatabase = useCallback(
    debounce(async (gameState: GameState, userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          money: Math.floor(gameState.money),
          dead_points: gameState.deadPoints,
          level: gameState.level,
          experience: Math.floor(gameState.experience),
          energy: gameState.energy,
          max_energy: gameState.maxEnergy,
          total_clicks: gameState.totalClicks,
          click_multiplier: gameState.clickMultiplier,
          energy_regen: gameState.energyRegenRate,
          auto_click_end_time: gameState.autoClickEndTime,
          auto_click_reward: gameState.autoClickReward,
          special_auto_click_end_time: gameState.specialAutoClickEndTime,
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error saving to database:', error);
      }
    }, 2000),
    []
  );

  // Save state to localStorage and database
  useEffect(() => {
    if (!isLoaded) return;
    
    localStorage.setItem('skullClickerState', JSON.stringify(state));
    
    if (user) {
      saveToDatabase(state, user.id);
    }
  }, [state, user, isLoaded, saveToDatabase]);

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

  // Miners passive income (DeadSpot per second)
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        let totalDeadPerSec = 0;
        for (const owned of prev.miners) {
          const def = MINER_DEFINITIONS.find(m => m.id === owned.id);
          if (def) {
            totalDeadPerSec += def.deadSpotPerSec * owned.count;
          }
        }
        if (totalDeadPerSec === 0) return prev;
        return { ...prev, deadPoints: prev.deadPoints + totalDeadPerSec };
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
    
    if (user) {
      supabase
        .from('profiles')
        .update({
          money: 0,
          dead_points: 0,
          level: 1,
          experience: 0,
          energy: 100,
          max_energy: 100,
          total_clicks: 0,
          click_multiplier: 1,
          energy_regen: 1,
          auto_click_end_time: null,
          auto_click_reward: 0,
          special_auto_click_end_time: null,
        })
        .eq('user_id', user.id);
    }
  }, [user]);

  const buyMiner = useCallback((minerId: string) => {
    setState(prev => {
      const def = MINER_DEFINITIONS.find(m => m.id === minerId);
      if (!def) return prev;
      const owned = prev.miners.find(m => m.id === minerId);
      const count = owned ? owned.count : 0;
      const cost = def.baseCost * Math.pow(1.8, count);
      if (prev.money < cost) return prev;
      const newMiners = owned
        ? prev.miners.map(m => m.id === minerId ? { ...m, count: m.count + 1 } : m)
        : [...prev.miners, { id: minerId, count: 1 }];
      return { ...prev, money: prev.money - cost, miners: newMiners };
    });
  }, []);

  return {
    state,
    isClicking,
    floatingRewards,
    performClick,
    buyUpgrade,
    buyMiner,
    resetGame,
  };
};
