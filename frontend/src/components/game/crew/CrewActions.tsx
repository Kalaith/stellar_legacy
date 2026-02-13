// components/game/crew/CrewActions.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { uiConstants } from '../../../constants/uiConstants';

const CrewActions: React.FC = React.memo(() => {
  const { resources, crew, ship } = useGameStore();
  const { handleTrainCrew, handleBoostMorale, handleRecruitCrew } = useGameActions();

  const actionStates = useMemo(() => {
    const canTrain = resources.credits >= 100;
    const canBoostMorale = resources.credits >= 50;
    const canRecruit = resources.credits >= 200 && crew.length < ship.stats.crewCapacity;

    return { canTrain, canBoostMorale, canRecruit };
  }, [resources.credits, crew.length, ship.stats.crewCapacity]);

  return (
    <Card title="Crew Actions">
      <div className="space-y-4">
        <ActionButton
          onClick={handleTrainCrew}
          disabled={!actionStates.canTrain}
          title="Train Crew"
          description="Improve random crew member's skills"
          cost="100 Credits"
          canAfford={actionStates.canTrain}
        />

        <ActionButton
          onClick={handleBoostMorale}
          disabled={!actionStates.canBoostMorale}
          title="Boost Morale"
          description="Increase all crew morale by 10"
          cost="50 Credits"
          canAfford={actionStates.canBoostMorale}
        />

        <ActionButton
          onClick={handleRecruitCrew}
          disabled={!actionStates.canRecruit}
          title="Recruit New Member"
          description="Add a new crew member to your ship"
          cost="200 Credits"
          canAfford={actionStates.canRecruit}
        />

        {crew.length >= ship.stats.crewCapacity && (
          <div className={`${uiConstants.NOTIFICATIONS.WARNING} ${uiConstants.SPACING.CARD_PADDING_SM}`}>
            <p className="text-sm">
              Ship at maximum crew capacity. Upgrade living quarters to recruit more crew.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
});

CrewActions.displayName = 'CrewActions';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  title: string;
  description: string;
  cost: string;
  canAfford: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  title,
  description,
  cost,
  canAfford
}) => (
  <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded-lg p-4 border ${uiConstants.COLORS.BORDER_LIGHT}`}>
    <div className={`flex justify-between items-start ${uiConstants.SPACING.SECTION_MARGIN_SM}`}>
      <h4 className={`${uiConstants.COLORS.TEXT_PRIMARY} font-semibold`}>{title}</h4>
      <span className={`${uiConstants.COLORS.TEXT_MUTED} text-sm`}>{cost}</span>
    </div>
    <p className={`${uiConstants.COLORS.TEXT_SECONDARY} text-sm mb-3`}>{description}</p>
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={canAfford ? 'primary' : 'secondary'}
      className="w-full"
    >
      {canAfford ? title : 'Cannot Afford'}
    </Button>
  </div>
);

export default CrewActions;