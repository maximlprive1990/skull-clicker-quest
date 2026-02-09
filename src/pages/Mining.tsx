import { useGameState, MINER_DEFINITIONS } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Pickaxe, ArrowLeft, Skull } from 'lucide-react';
import miner1Img from '@/assets/miner-1.png';
import miner2Img from '@/assets/miner-2.png';
import miner3Img from '@/assets/miner-3.png';
import miner4Img from '@/assets/miner-4.png';
import miner5Img from '@/assets/miner-5.png';
import miner6Img from '@/assets/miner-6.png';

const minerImages: Record<string, string> = {
  'miner-1': miner1Img,
  'miner-2': miner2Img,
  'miner-3': miner3Img,
  'miner-4': miner4Img,
  'miner-5': miner5Img,
  'miner-6': miner6Img,
};

const Mining = () => {
  const { state, buyMiner } = useGameState();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalDeadPerSec = state.miners.reduce((acc, owned) => {
    const def = MINER_DEFINITIONS.find(m => m.id === owned.id);
    return acc + (def ? def.deadSpotPerSec * owned.count : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
      {/* Navigation */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/game')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au jeu
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neon-gold font-game">${state.money.toFixed(4)}</span>
          <span className="text-neon-red font-game flex items-center gap-1">
            <Skull className="w-3 h-3" />
            {state.deadPoints.toFixed(6)}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <Pickaxe className="w-12 h-12 text-neon-purple mx-auto mb-3 animate-float" />
        <h1 className="font-display text-4xl md:text-5xl text-neon-purple tracking-wider mb-2">
          Minage DeadSpot
        </h1>
        <p className="text-muted-foreground text-sm">Achète des mineurs pour miner des DeadSpot passivement</p>
        {totalDeadPerSec > 0 && (
          <p className="text-neon-red text-sm mt-2 font-game">
            ⛏️ +{totalDeadPerSec.toFixed(6)} DeadSpot/sec
          </p>
        )}
      </div>

      {/* Miners Grid */}
      <div className="w-full max-w-2xl grid gap-4">
        {MINER_DEFINITIONS.map((def) => {
          const owned = state.miners.find(m => m.id === def.id);
          const count = owned ? owned.count : 0;
          const cost = def.baseCost * Math.pow(1.8, count);
          const canAfford = state.money >= cost;

          return (
            <div
              key={def.id}
              className="bg-gradient-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-accent/40 transition-colors"
            >
              {/* Miner Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                <img
                  src={minerImages[def.image]}
                  alt={def.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg text-neon-purple truncate">{def.name}</h3>
                  {count > 0 && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-game">
                      x{count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{def.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neon-red font-game">
                    +{def.deadSpotPerSec.toFixed(6)} DS/sec
                  </span>
                  {count > 0 && (
                    <span className="text-muted-foreground">
                      Total: +{(def.deadSpotPerSec * count).toFixed(6)}/sec
                    </span>
                  )}
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => buyMiner(def.id)}
                disabled={!canAfford}
                className={`shrink-0 px-4 py-2 rounded-lg font-game text-xs transition-all ${
                  canAfford
                    ? 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:scale-105'
                    : 'bg-muted border border-border text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                <div className="text-neon-gold font-bold">
                  ${cost >= 1000000 ? (cost / 1000000).toFixed(1) + 'M' : cost >= 1000 ? (cost / 1000).toFixed(1) + 'K' : cost.toFixed(0)}
                </div>
                <div className="text-[10px] mt-0.5">$CAD</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      {!user && (
        <p className="text-xs text-neon-green/70 mt-8">
          🔐 Connecte-toi pour sauvegarder tes mineurs!
        </p>
      )}
    </div>
  );
};

export default Mining;
