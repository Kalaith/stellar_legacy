// components/game/dashboard/CrewSummary.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const CrewSummary: React.FC = () => {
  const { crew } = useGameStore();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Active Crew</h3>

      <div className="space-y-3">
        {crew.map(member => (
          <CrewMemberItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

interface CrewMemberItemProps {
  member: {
    id: number;
    name: string;
    role: string;
    morale: number;
  };
}

const CrewMemberItem: React.FC<CrewMemberItemProps> = ({ member }) => {
  const getMoraleColor = (morale: number) => {
    if (morale > 70) return 'bg-green-500';
    if (morale > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center justify-between bg-slate-700 rounded p-3">
      <div className="flex-1">
        <div className="text-white font-medium">{member.name}</div>
        <div className="text-slate-400 text-sm">{member.role}</div>
      </div>
      <div
        className={`w-3 h-3 rounded-full ${getMoraleColor(member.morale)}`}
      />
    </div>
  );
};

export default CrewSummary;
