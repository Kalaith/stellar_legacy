// components/game/dashboard/ShipStatus.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const ShipStatus: React.FC = () => {
  const { ship } = useGameStore();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Ship Status: {ship.name}</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-6xl">🚀</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Speed" value={ship.stats.speed} />
        <StatItem label="Cargo" value={ship.stats.cargo} />
        <StatItem label="Combat" value={ship.stats.combat} />
        <StatItem label="Research" value={ship.stats.research} />
        <StatItem label="Crew Capacity" value={ship.stats.crewCapacity} />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-3">Components</h4>
        <div className="space-y-2">
          <ComponentItem label="Hull" value={ship.hull} />
          <ComponentItem label="Engine" value={ship.components.engine} />
          <ComponentItem label="Cargo Bay" value={ship.components.cargo} />
          <ComponentItem label="Weapons" value={ship.components.weapons} />
          <ComponentItem label="Research" value={ship.components.research} />
          <ComponentItem label="Quarters" value={ship.components.quarters} />
        </div>
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="bg-slate-700 rounded p-3">
    <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
    <div className="text-lg font-semibold text-white">{value}</div>
  </div>
);

interface ComponentItemProps {
  label: string;
  value: string;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-slate-300">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default ShipStatus;