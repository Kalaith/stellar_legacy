// components/game/dashboard/ShipStatus.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import Card from '../../ui/Card';
import Grid from '../../ui/Grid';

const ShipStatus: React.FC = React.memo(() => {
  const { ship } = useGameStore();

  return (
    <Card title={`Ship Status: ${ship.name}`}>
      <div className="text-center">
        <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
          <div className="text-6xl">🚀</div>
        </div>
        <h4 className="text-lg text-white font-semibold">{ship.name}</h4>
      </div>

      <Grid columns={2} gap={4} className="mb-6">
        <StatItem label="Speed" value={ship.stats.speed} />
        <StatItem label="Cargo" value={ship.stats.cargo} />
        <StatItem label="Combat" value={ship.stats.combat} />
        <StatItem label="Research" value={ship.stats.research} />
        <StatItem label="Crew Capacity" value={ship.stats.crewCapacity} />
      </Grid>

      <div className="border-t border-slate-700 pt-4">
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
    </Card>
  );
});

ShipStatus.displayName = 'ShipStatus';

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = React.memo(({ label, value }) => (
  <div className="bg-slate-700 rounded p-3">
    <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
    <div className="text-lg font-semibold text-white">{value}</div>
  </div>
));
StatItem.displayName = 'StatItem';

interface ComponentItemProps {
  label: string;
  value: string;
}

const ComponentItem: React.FC<ComponentItemProps> = React.memo(({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-slate-300">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
));
ComponentItem.displayName = 'ComponentItem';

export default ShipStatus;