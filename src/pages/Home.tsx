import { useNavigate } from 'react-router-dom';
import { Skull, MousePointerClick, Pickaxe, Users, ArrowDownToLine, Zap, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(142_100%_50%_/_0.05)_0%,_transparent_70%)]" />
        <Skull className="w-24 h-24 text-neon-green animate-float mb-6" />
        <h1 className="font-display text-6xl md:text-8xl text-neon-green tracking-wider mb-4">
          Skull Clicker
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8">
          Clique, mine, parraine et <span className="text-neon-gold">retire tes gains</span> en $CAD et DeadSpot.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate('/game')}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-neon-green hover:scale-105 transition-transform text-lg"
          >
            🎮 Jouer maintenant
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 border border-primary/40 text-primary rounded-lg hover:bg-primary/10 transition-colors text-lg"
          >
            Créer un compte
          </button>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-neon-green mb-4">Comment ça marche?</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          3 façons de gagner, des récompenses réelles à retirer.
        </p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Click Game */}
          <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-neon-green transition-shadow">
              <MousePointerClick className="w-8 h-8 text-neon-green" />
            </div>
            <h3 className="font-display text-2xl text-neon-green mb-3">Jeu de Click</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Clique sur le crâne pour gagner des <span className="text-neon-gold">$CAD</span> et des <span className="text-neon-red">Dead Points</span>. Améliore ton multiplicateur et débloque des bonus automatiques.
            </p>
          </div>

          {/* Mining */}
          <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center hover:border-accent/40 transition-colors group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-accent/10 flex items-center justify-center group-hover:shadow-neon-purple transition-shadow">
              <Pickaxe className="w-8 h-8 text-neon-purple" />
            </div>
            <h3 className="font-display text-2xl text-neon-purple mb-3">Minage DeadSpot</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Mine des <span className="text-neon-red">DeadSpot</span> en continu grâce aux upgrades automatiques. Plus tu mines, plus tes récompenses augmentent.
            </p>
          </div>

          {/* Referrals */}
          <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center hover:border-neon-gold/40 transition-colors group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[hsl(var(--neon-gold)_/_0.1)] flex items-center justify-center group-hover:drop-shadow-[0_0_20px_hsl(var(--neon-gold)_/_0.5)] transition-all">
              <Users className="w-8 h-8 text-neon-gold" />
            </div>
            <h3 className="font-display text-2xl text-neon-gold mb-3">Bonus Parrainage</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Invite tes amis et gagne un <span className="text-neon-gold">bonus de 10%</span> sur tous leurs gains. Plus ton réseau grandit, plus tu gagnes passivement.
            </p>
          </div>
        </div>
      </section>

      {/* Retraits */}
      <section className="py-20 px-4 bg-card/50">
        <h2 className="font-display text-4xl md:text-5xl text-center text-neon-gold mb-4">Retire tes gains 💰</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Tes $CAD et DeadSpot sont convertibles en récompenses réelles.
        </p>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* $CAD */}
          <div className="bg-gradient-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,_hsl(var(--neon-gold)_/_0.08)_0%,_transparent_70%)]" />
            <div className="flex items-center gap-3 mb-4">
              <ArrowDownToLine className="w-6 h-6 text-neon-gold" />
              <h3 className="font-display text-2xl text-neon-gold">Retrait $CAD</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-neon-gold mt-0.5 shrink-0" />
                <span>Accumule des $CAD en cliquant et en minant</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-neon-gold mt-0.5 shrink-0" />
                <span>Minimum de retrait : <strong className="text-neon-gold">500 $CAD</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-neon-gold mt-0.5 shrink-0" />
                <span>Convertis en récompenses ou en crédits utilisables</span>
              </li>
            </ul>
          </div>

          {/* DeadSpot */}
          <div className="bg-gradient-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,_hsl(var(--neon-red)_/_0.08)_0%,_transparent_70%)]" />
            <div className="flex items-center gap-3 mb-4">
              <ArrowDownToLine className="w-6 h-6 text-neon-red" />
              <h3 className="font-display text-2xl text-neon-red">Retrait DeadSpot</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-neon-red mt-0.5 shrink-0" />
                <span>Mine des DeadSpot avec les upgrades automatiques</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-neon-red mt-0.5 shrink-0" />
                <span>Minimum de retrait : <strong className="text-neon-red">1000 DeadSpot</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-neon-red mt-0.5 shrink-0" />
                <span>Échange contre des items exclusifs ou des $CAD</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-neon-green mb-6">Prêt à jouer?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Crée ton compte gratuitement et commence à accumuler tes récompenses dès maintenant.
        </p>
        <button
          onClick={() => navigate('/game')}
          className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-lg shadow-neon-green hover:scale-105 transition-transform text-xl"
        >
          🚀 Commencer maintenant
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Skull Clicker — Tous droits réservés
        </p>
      </footer>
    </div>
  );
};

export default Home;
