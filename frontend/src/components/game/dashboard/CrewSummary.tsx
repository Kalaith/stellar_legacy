// components/game/dashboard/CrewSummary.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import Card from '../../ui/Card';

const CrewSummary: React.FC = React.memo(() => {
  const { crew } = useGameStore();

  const totalMorale = useMemo(() =>
    crew.reduce((sum, member) => sum + member.morale, 0) / crew.length,
    [crew]
  );

  return (
    <Card title="Active Crew">
      <div className="text-slate-300 text-sm mb-4">
        Average Morale: {totalMorale.toFixed(1)}%
      </div>

      <div className="space-y-3">
        {crew.map(member => (
          <CrewMemberItem key={member.id} member={member} />
        ))}
      </div>
    </Card>
  );
});

CrewSummary.displayName = 'CrewSummary';CrewSummary.displayName = 'CrewSummary';

interface CrewMemberItemProps {
  member: {
    id: number;
    name: string;
    role: string;
    morale: number;
  };
}

const CrewMemberItem: React.FC<CrewMemberItemProps> = React.memo(({ member }) => {
  const getMoraleColor = useMemo(() => (morale: number) => {
    if (morale > 70) return 'bg-green-500';
    if (morale > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  return (
    <div className="flex items-center justify-between bg-slate-700 rounded p-3">
      <div className="flex-1">
        <div className="text-white font-medium">{member.name}</div>
        <div className="text-slate-400 text-sm">{member.role}</div>
      </div>
      <div className={`w-3 h-3 rounded-full ${getMoraleColor(member.morale)}`} />
    </div>
  );
});

CrewMemberItem.displayName = 'CrewMemberItem';

export default CrewSummary;