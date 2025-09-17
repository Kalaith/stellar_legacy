// components/game/crew/CrewGrid.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const CrewGrid: React.FC = () => {
  const { crew } = useGameStore();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">Current Crew</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crew.map(member => (
          <CrewCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

interface CrewCardProps {
  member: {
    id: number;
    name: string;
    role: string;
    skills: {
      engineering: number;
      navigation: number;
      combat: number;
      diplomacy: number;
      trade: number;
    };
    morale: number;
    background: string;
    age: number;
    isHeir: boolean;
  };
}

const CrewCard: React.FC<CrewCardProps> = React.memo(({ member }) => {
  const getMoraleColor = useMemo(() => (morale: number) => {
    if (morale > 70) return 'bg-green-500';
    if (morale > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  const getSkillBarWidth = useMemo(() => (level: number) => `${(level / 10) * 100}%`, []);

  const skillEntries = useMemo(() =>
    Object.entries(member.skills),
    [member.skills]
  );

  return (
    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <h4 className="text-white font-semibold">{member.name}</h4>
            <p className="text-slate-400 text-sm">{member.role} • Age {member.age}</p>
          </div>
        </div>
        {member.isHeir && (
          <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded">
            Heir
          </span>
        )}
      </div>

      <div className="space-y-2 mb-3">
        {skillEntries.map(([skill, level]) => (
          <div key={skill} className="flex items-center justify-between">
            <span className="text-slate-300 text-sm capitalize w-20">{skill}</span>
            <div className="flex-1 mx-2">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: getSkillBarWidth(level) }}
                />
              </div>
            </div>
            <span className="text-white text-sm w-6 text-right">{level}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-300 text-sm">Morale</span>
        <div className="flex items-center space-x-2">
          <div className="w-20 bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getMoraleColor(member.morale)}`}
              style={{ width: `${member.morale}%` }}
            />
          </div>
          <span className="text-white text-sm w-8 text-right">{member.morale}</span>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed">{member.background}</p>
    </div>
  );
});

CrewCard.displayName = 'CrewCard';

export default CrewGrid;