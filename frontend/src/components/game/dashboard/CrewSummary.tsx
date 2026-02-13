// components/game/dashboard/CrewSummary.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import Card from '../../ui/Card';
import { uiConstants } from '../../../constants/uiConstants';
import type { CrewMemberId } from '../../../types/branded';

const CrewSummary: React.FC = React.memo(() => {
  const { crew } = useGameStore();

  const totalMorale = useMemo(
    () => crew.reduce((sum, member) => sum + member.morale, 0) / crew.length,
    [crew]
  );

  return (
    <Card title="Active Crew">
      <div
        className={`${uiConstants.COLORS.TEXT_SECONDARY} text-sm ${uiConstants.SPACING.SECTION_MARGIN_SM}`}
      >
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

CrewSummary.displayName = 'CrewSummary';

interface CrewMemberItemProps {
  member: {
    id: CrewMemberId;
    name: string;
    role: string;
    morale: number;
  };
}

const CrewMemberItem: React.FC<CrewMemberItemProps> = React.memo(
  ({ member }) => {
    const getMoraleColor = useMemo(
      () => (morale: number) => {
        if (morale > 70) return 'bg-green-400'; // Keep green for morale visual - semantic use
        if (morale > 50) return 'bg-yellow-600'; // Yellow for warning state
        return 'bg-red-500'; // Red for low morale
      },
      []
    );

    return (
      <div
        className={`flex items-center justify-between ${uiConstants.COLORS.BG_SECONDARY} rounded ${uiConstants.SPACING.CARD_PADDING_SM}`}
      >
        <div className="flex-1">
          <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
            {member.name}
          </div>
          <div className={`${uiConstants.COLORS.TEXT_MUTED} text-sm`}>
            {member.role}
          </div>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${getMoraleColor(member.morale)}`}
        />
      </div>
    );
  }
);

CrewMemberItem.displayName = 'CrewMemberItem';

export default CrewSummary;
