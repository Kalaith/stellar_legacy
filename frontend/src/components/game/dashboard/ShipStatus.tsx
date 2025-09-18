// components/game/dashboard/ShipStatus.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import Card from '../../ui/Card';
import Grid from '../../ui/Grid';
import { UI_CONSTANTS } from '../../../constants/uiConstants';

const ShipStatus: React.FC = React.memo(() => {
  const { ship } = useGameStore();

  return (
    <Card title={`Ship Status: ${ship.name}`}>
      <div className="text-center">
        <div className={`${UI_CONSTANTS.SHIP_STATUS.ICON_SIZE} ${UI_CONSTANTS.SHIP_STATUS.ICON_BG} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          <div className="text-6xl">🚀</div>
        </div>
        <h4 className={`text-lg ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} font-semibold`}>{ship.name}</h4>
      </div>

      <Grid columns={UI_CONSTANTS.SHIP_STATUS.GRID_COLUMNS} gap={UI_CONSTANTS.SHIP_STATUS.GRID_GAP} className={UI_CONSTANTS.SPACING.SECTION_MARGIN}>
        <StatItem label="Speed" value={ship.stats.speed} />
        <StatItem label="Cargo" value={ship.stats.cargo} />
        <StatItem label="Combat" value={ship.stats.combat} />
        <StatItem label="Research" value={ship.stats.research} />
        <StatItem label="Crew Capacity" value={ship.stats.crewCapacity} />
      </Grid>

      <div className={`border-t ${UI_CONSTANTS.COLORS.BORDER} pt-4`}>
        <h4 className={`text-lg font-semibold ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} mb-3`}>Components</h4>
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
  <div className={`${UI_CONSTANTS.SHIP_STATUS.STAT_ITEM_BG} rounded ${UI_CONSTANTS.SPACING.CARD_PADDING}`}>
    <div className={`text-xs ${UI_CONSTANTS.COLORS.TEXT_MUTED} uppercase tracking-wide`}>{label}</div>
    <div className={`text-lg font-semibold ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{value}</div>
  </div>
));
StatItem.displayName = 'StatItem';

interface ComponentItemProps {
  label: string;
  value: string;
}

const ComponentItem: React.FC<ComponentItemProps> = React.memo(({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className={UI_CONSTANTS.COLORS.TEXT_SECONDARY}>{label}:</span>
    <span className={`${UI_CONSTANTS.COLORS.TEXT_PRIMARY} font-medium`}>{value}</span>
  </div>
));
ComponentItem.displayName = 'ComponentItem';

export default ShipStatus;