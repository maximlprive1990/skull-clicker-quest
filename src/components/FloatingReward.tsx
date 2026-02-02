interface FloatingRewardProps {
  rewards: Array<{ id: number; value: number; type: 'money' | 'xp' | 'dead' }>;
}

export const FloatingReward = ({ rewards }: FloatingRewardProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 animate-reward-float font-bold text-lg"
          style={{
            left: `${45 + Math.random() * 10}%`,
          }}
        >
          <span className={
            reward.type === 'money' 
              ? 'text-neon-gold' 
              : reward.type === 'dead' 
                ? 'text-neon-red' 
                : 'text-neon-purple'
          }>
            {reward.type === 'money' && `+$${reward.value.toFixed(4)}`}
            {reward.type === 'dead' && `+${reward.value}💀`}
            {reward.type === 'xp' && `+${reward.value.toFixed(1)} XP`}
          </span>
        </div>
      ))}
    </div>
  );
};
