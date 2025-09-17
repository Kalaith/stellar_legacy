// components/game/dashboard/EmpireOverview.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const EmpireOverview: React.FC = () => {
  const { starSystems, legacy } = useGameStore();
  const captain = useGameStore(state =>
    state.crew.find(c => c.role === 'Captain')
  );

  const exploredSystems = starSystems.filter(
    s => s.status === 'explored'
  ).length;
  const activeColonies = starSystems.reduce(
    (acc, sys) => acc + sys.planets.filter(p => p.developed).length,
    0
  );
  const tradeRoutes = starSystems.reduce(
    (acc, sys) => acc + sys.tradeRoutes.length,
    0
  );

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Empire Overview</h3>

      <div className="space-y-3">
        <StatItem label="Systems Explored" value={exploredSystems} />
        <StatItem label="Active Colonies" value={activeColonies} />
        <StatItem label="Trade Routes" value={tradeRoutes} />
        <StatItem label="Captain Age" value={captain?.age || 0} />
        <StatItem label="Generation" value={legacy.generation} />
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
    <span className="text-slate-300">{label}:</span>
    <span className="text-white font-semibold">{value}</span>
  </div>
);

export default EmpireOverview;
