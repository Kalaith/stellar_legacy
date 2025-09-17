// components/game/crew/CrewActions.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

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
          <div className="bg-yellow-900 border border-yellow-700 rounded p-3">
            <p className="text-yellow-200 text-sm">
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
  <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-white font-semibold">{title}</h4>
      <span className="text-slate-400 text-sm">{cost}</span>
    </div>
    <p className="text-slate-300 text-sm mb-3">{description}</p>
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