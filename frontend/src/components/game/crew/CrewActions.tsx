// components/game/crew/CrewActions.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';

const CrewActions: React.FC = () => {
  const { resources, crew, ship } = useGameStore();
  const { handleTrainCrew, handleBoostMorale, handleRecruitCrew } =
    useGameActions();

  const canTrain = resources.credits >= 100;
  const canBoostMorale = resources.credits >= 50;
  const canRecruit =
    resources.credits >= 200 && crew.length < ship.stats.crewCapacity;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">Crew Actions</h3>

      <div className="space-y-4">
        <ActionButton
          onClick={handleTrainCrew}
          disabled={!canTrain}
          title="Train Crew"
          description="Improve random crew member's skills"
          cost="100 Credits"
          canAfford={canTrain}
        />

        <ActionButton
          onClick={handleBoostMorale}
          disabled={!canBoostMorale}
          title="Boost Morale"
          description="Increase all crew morale by 10"
          cost="50 Credits"
          canAfford={canBoostMorale}
        />

        <ActionButton
          onClick={handleRecruitCrew}
          disabled={!canRecruit}
          title="Recruit New Member"
          description="Add a new crew member to your ship"
          cost="200 Credits"
          canAfford={canRecruit}
        />

        {crew.length >= ship.stats.crewCapacity && (
          <div className="bg-yellow-900 border border-yellow-700 rounded p-3">
            <p className="text-yellow-200 text-sm">
              Ship at maximum crew capacity. Upgrade living quarters to recruit
              more crew.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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
  canAfford,
}) => (
  <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-white font-semibold">{title}</h4>
      <span className="text-slate-400 text-sm">{cost}</span>
    </div>
    <p className="text-slate-300 text-sm mb-3">{description}</p>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded font-medium transition-colors ${
        canAfford
          ? 'bg-teal-600 hover:bg-teal-700 text-white'
          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
      }`}
    >
      {canAfford ? title : 'Cannot Afford'}
    </button>
  </div>
);

export default CrewActions;
