// components/game/dashboard/EmpireOverview.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import Card from '../../ui/Card';
import { GameEngine } from '../../../services/GameEngine';
import { uiConstants } from '../../../constants/uiConstants';

const EmpireOverview: React.FC = React.memo(() => {
  const { starSystems, legacy } = useGameStore();
  const captain = useGameStore(state => state.crew.find(c => c.role === 'Captain'));

  const stats = useMemo(() => {
    const empireStats = GameEngine.calculateEmpireStats(starSystems, legacy);
    return {
      ...empireStats,
      captainAge: captain?.age || 0,
    };
  }, [starSystems, legacy, captain?.age]);

  return (
    <Card title="Empire Overview">
      <div className="space-y-3">
        <StatItem label="Systems Explored" value={stats.exploredSystems} />
        <StatItem label="Active Colonies" value={stats.activeColonies} />
        <StatItem label="Trade Routes" value={stats.tradeRoutes} />
        <StatItem label="Captain Age" value={stats.captainAge} />
        <StatItem label="Generation" value={stats.generation} />
      </div>
    </Card>
  );
});

EmpireOverview.displayName = 'EmpireOverview';

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className={`flex justify-between items-center py-2 border-b ${uiConstants.COLORS.BORDER} last:border-b-0`}>
    <span className={uiConstants.COLORS.TEXT_SECONDARY}>{label}:</span>
    <span className={`${uiConstants.COLORS.TEXT_PRIMARY} font-semibold`}>{value}</span>
  </div>
);

export default EmpireOverview;
