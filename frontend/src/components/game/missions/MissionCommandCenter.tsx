// components/game/missions/MissionCommandCenter.tsx
import React, { useState } from 'react';
import { useGenerationalMissionStore, useCurrentMission, useActiveEvents } from '../../../stores/useGenerationalMissionStore';
import { TerminalWindow, TerminalText, TerminalButton, TerminalSelect, TerminalInput, TerminalProgress, TerminalTable } from '../../ui/TerminalWindow';
import type { GenerationalMission, MissionEvent } from '../../../types/generationalMissions';
import type { SectTypeType, MissionObjectiveType } from '../../../types/enums';

interface MissionCommandCenterProps {
  className?: string;
}

export const MissionCommandCenter: React.FC<MissionCommandCenterProps> = ({ className = '' }) => {
  const {
    missions,
    activeMissions,
    selectedMission,
    selectMission,
    processMissionTurn,
    createMission,
    resolveEvent,
    selectEvent,
    selectedEventId
  } = useGenerationalMissionStore();

  const activeEvents = useActiveEvents();

  const [showCreateMission, setShowCreateMission] = useState(false);
  const [newMissionConfig, setNewMissionConfig] = useState({
    name: '',
    sect: 'preservers' as SectTypeType,
    objective: 'colonization' as MissionObjectiveType,
    targetSystemId: 'system_1',
    estimatedDuration: 200,
    shipClass: 'colony',
    shipSize: 'large',
    populationSize: 25000
  });

  const activeMissionsList = missions.filter(m => activeMissions.includes(m.id));
  const selectedEvent = activeEvents.find(e => e.id === selectedEventId);

  const handleCreateMission = () => {
    if (!newMissionConfig.name) return;

    createMission(newMissionConfig);
    setShowCreateMission(false);
    setNewMissionConfig(prev => ({ ...prev, name: '' }));
  };

  const handleAdvanceTime = (years: number = 1) => {
    if (!selectedMission) return;
    processMissionTurn(selectedMission.id, years);
  };

  const handleResolveEvent = (outcomeId: string) => {
    if (!selectedMission || !selectedEvent) return;
    resolveEvent(selectedMission.id, selectedEvent.id, outcomeId);
  };

  return (
    <TerminalWindow title="MISSION COMMAND CENTER" statusLine="OPERATIONAL" className={className}>
      {/* Header */}
      <div className="terminal-flex between mb-6">
        <TerminalText variant="bright">GENERATIONAL OPERATIONS CONTROL</TerminalText>
        <TerminalButton
          onClick={() => setShowCreateMission(true)}
          variant="success"
        >
          LAUNCH NEW MISSION
        </TerminalButton>
      </div>

      <div className="terminal-grid cols-3">
        {/* Mission List */}
        <TerminalWindow title="ACTIVE MISSIONS" statusLine={`${activeMissionsList.length} OPERATIONS`}>
          <div className="terminal-space-y max-h-96 overflow-y-auto">
            {activeMissionsList.length === 0 ? (
              <TerminalText variant="dim">NO ACTIVE MISSIONS</TerminalText>
            ) : (
              activeMissionsList.map(mission => (
                <TerminalMissionCard
                  key={mission.id}
                  mission={mission}
                  isSelected={selectedMission?.id === mission.id}
                  onSelect={() => selectMission(mission.id)}
                />
              ))
            )}
          </div>
        </TerminalWindow>

        {/* Mission Details */}
        <TerminalWindow title="MISSION DETAILS" statusLine={selectedMission ? "ANALYZING" : "STANDBY"}>
          {selectedMission ? (
            <TerminalMissionDetails
              mission={selectedMission}
              onAdvanceTime={handleAdvanceTime}
            />
          ) : (
            <TerminalText variant="dim">SELECT A MISSION TO VIEW DETAILS</TerminalText>
          )}
        </TerminalWindow>

        {/* Events & Actions */}
        <TerminalWindow title="EVENTS & ACTIONS" statusLine={activeEvents.length > 0 ? "ATTENTION REQUIRED" : "MONITORING"}>
          {selectedMission ? (
            <TerminalEventsPanel
              mission={selectedMission}
              events={activeEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={selectEvent}
              onResolveEvent={handleResolveEvent}
            />
          ) : (
            <TerminalText variant="dim">SELECT A MISSION TO MANAGE EVENTS</TerminalText>
          )}
        </TerminalWindow>
      </div>

      {/* Create Mission Terminal */}
      {showCreateMission && (
        <TerminalCreateMission
          config={newMissionConfig}
          onChange={setNewMissionConfig}
          onConfirm={handleCreateMission}
          onCancel={() => setShowCreateMission(false)}
        />
      )}
    </TerminalWindow>
  );
};

// Terminal Mission Card Component
const TerminalMissionCard: React.FC<{
  mission: GenerationalMission;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ mission, isSelected, onSelect }) => {
  const progressPercentage = (mission.currentYear / mission.estimatedDuration) * 100;
  const hasUrgentEvents = mission.activeEvents.some(e => e.requiresPlayerDecision);

  return (
    <div
      onClick={onSelect}
      className={`terminal-list-item selectable ${
        isSelected ? 'selected' : ''
      } ${
        hasUrgentEvents ? 'alert' : ''
      }`}
      style={{ cursor: 'pointer', padding: '0.75rem', border: isSelected ? '1px solid var(--terminal-primary)' : '1px solid var(--terminal-border)' }}
    >
      <div className="terminal-flex between">
        <div className="flex-1">
          <TerminalText variant={isSelected ? 'bright' : 'primary'}>
            {mission.name.toUpperCase()}
          </TerminalText>
          <div className="terminal-text dim">
            {mission.sect.toUpperCase()} • {mission.objective.toUpperCase()}
          </div>
          <div className="terminal-text dim">
            YEAR {mission.currentYear}/{mission.estimatedDuration}
          </div>

          {/* Progress Bar */}
          <TerminalProgress
            value={progressPercentage}
            max={100}
            ascii
            variant="primary"
          />
        </div>

        {hasUrgentEvents && (
          <TerminalText variant="error" glow>
            [!]
          </TerminalText>
        )}
      </div>
    </div>
  );
};

// Terminal Mission Details Component
const TerminalMissionDetails: React.FC<{
  mission: GenerationalMission;
  onAdvanceTime: (years: number) => void;
}> = ({ mission, onAdvanceTime }) => {
  const populationSurvivalRate = (mission.population.total / mission.ship.populationCapacity) * 100;

  return (
    <div className="terminal-space-y">
      {/* Key Metrics */}
      <div>
        <TerminalText variant="bright">MISSION PARAMETERS:</TerminalText>
        <TerminalTable
          headers={['PARAMETER', 'VALUE', 'STATUS']}
          rows={[
            [
              'POPULATION',
              mission.population.total.toLocaleString(),
              <TerminalText variant={populationSurvivalRate > 90 ? 'success' : populationSurvivalRate > 70 ? 'warning' : 'error'}>
                {populationSurvivalRate.toFixed(1)}% SURVIVAL
              </TerminalText>
            ],
            [
              'MISSION PROGRESS',
              `${mission.phaseProgress}%`,
              <TerminalText variant="primary">
                {mission.currentPhase.toUpperCase()} PHASE
              </TerminalText>
            ],
            [
              'DURATION',
              `${mission.currentYear}/${mission.estimatedDuration}`,
              <TerminalText variant="primary">
                {((mission.currentYear / mission.estimatedDuration) * 100).toFixed(1)}% COMPLETE
              </TerminalText>
            ]
          ]}
        />
      </div>

      {/* Resource Summary */}
      <div>
        <TerminalText variant="bright">RESOURCE STATUS:</TerminalText>
        <TerminalTable
          headers={['RESOURCE', 'QUANTITY', 'STATUS']}
          rows={[
            [
              'FOOD',
              mission.resources.food.toLocaleString(),
              <TerminalText variant={mission.resources.food > 5000 ? 'success' : mission.resources.food > 2000 ? 'warning' : 'error'}>
                {mission.resources.food > 5000 ? 'OPTIMAL' : mission.resources.food > 2000 ? 'LOW' : 'CRITICAL'}
              </TerminalText>
            ],
            [
              'ENERGY',
              mission.resources.energy.toLocaleString(),
              <TerminalText variant={mission.resources.energy > 8000 ? 'success' : mission.resources.energy > 4000 ? 'warning' : 'error'}>
                {mission.resources.energy > 8000 ? 'OPTIMAL' : mission.resources.energy > 4000 ? 'LOW' : 'CRITICAL'}
              </TerminalText>
            ],
            [
              'HULL INTEGRITY',
              `${(mission.resources.hullIntegrity * 100).toFixed(1)}%`,
              <TerminalText variant={mission.resources.hullIntegrity > 0.8 ? 'success' : mission.resources.hullIntegrity > 0.5 ? 'warning' : 'error'}>
                {mission.resources.hullIntegrity > 0.8 ? 'OPTIMAL' : mission.resources.hullIntegrity > 0.5 ? 'DAMAGED' : 'CRITICAL'}
              </TerminalText>
            ],
            [
              'CREW MORALE',
              `${(mission.resources.morale * 100).toFixed(1)}%`,
              <TerminalText variant={mission.resources.morale > 0.7 ? 'success' : mission.resources.morale > 0.4 ? 'warning' : 'error'}>
                {mission.resources.morale > 0.7 ? 'HIGH' : mission.resources.morale > 0.4 ? 'MODERATE' : 'LOW'}
              </TerminalText>
            ]
          ]}
        />
      </div>

      {/* Time Controls */}
      <div>
        <TerminalText variant="bright">TIME ACCELERATION:</TerminalText>
        <div className="terminal-flex gap-2 mt-2">
          <TerminalButton
            onClick={() => onAdvanceTime(1)}
            variant="primary"
          >
            +1 YEAR
          </TerminalButton>
          <TerminalButton
            onClick={() => onAdvanceTime(5)}
            variant="primary"
          >
            +5 YEARS
          </TerminalButton>
          <TerminalButton
            onClick={() => onAdvanceTime(10)}
            variant="warning"
          >
            +10 YEARS
          </TerminalButton>
        </div>
      </div>
    </div>
  );
};

// Terminal Events Panel Component
const TerminalEventsPanel: React.FC<{
  mission: GenerationalMission;
  events: MissionEvent[];
  selectedEvent: MissionEvent | undefined;
  onSelectEvent: (eventId: string | null) => void;
  onResolveEvent: (outcomeId: string) => void;
}> = ({ events, selectedEvent, onSelectEvent, onResolveEvent }) => {
  if (events.length === 0) {
    return (
      <div className="terminal-space-y text-center">
        <TerminalText variant="dim">NO ACTIVE EVENTS</TerminalText>
        <TerminalText variant="dim">MISSION PROCEEDING NOMINALLY</TerminalText>
      </div>
    );
  }

  return (
    <div className="terminal-space-y">
      {/* Event List */}
      <div>
        <TerminalText variant="bright">ACTIVE EVENTS:</TerminalText>
        <div className="terminal-space-y-sm max-h-48 overflow-y-auto">
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className={`terminal-list-item selectable ${
                selectedEvent?.id === event.id ? 'selected' : ''
              } ${
                event.requiresPlayerDecision ? 'alert' : ''
              }`}
              style={{ cursor: 'pointer', padding: '0.5rem', border: selectedEvent?.id === event.id ? '1px solid var(--terminal-primary)' : '1px solid var(--terminal-border)' }}
            >
              <div className="terminal-flex between">
                <div className="flex-1">
                  <TerminalText variant={selectedEvent?.id === event.id ? 'bright' : 'primary'}>
                    {event.title.toUpperCase()}
                  </TerminalText>
                  <div className="terminal-text dim">
                    {event.category.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                {event.requiresPlayerDecision && (
                  <TerminalText variant="error" glow>
                    [ACTION REQUIRED]
                  </TerminalText>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <div style={{ border: '1px solid var(--terminal-border)', padding: '1rem' }}>
          <TerminalText variant="bright">{selectedEvent.title.toUpperCase()}</TerminalText>
          <div className="terminal-text mt-2 mb-4">{selectedEvent.description}</div>

          {selectedEvent.requiresPlayerDecision && (
            <div className="terminal-space-y">
              <TerminalText variant="bright">RESPONSE OPTIONS:</TerminalText>
              {selectedEvent.possibleOutcomes.map(outcome => (
                <TerminalButton
                  key={outcome.id}
                  onClick={() => onResolveEvent(outcome.id)}
                  variant="primary"
                  fullWidth
                >
                  <div>
                    <div className="font-bold">{outcome.title.toUpperCase()}</div>
                    <div className="text-sm opacity-75">{outcome.description}</div>
                  </div>
                </TerminalButton>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Terminal Create Mission Component
const TerminalCreateMission: React.FC<{
  config: any;
  onChange: (config: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ config, onChange, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <TerminalWindow title="MISSION LAUNCH PROTOCOLS" statusLine="CONFIGURING" className="w-96 max-w-90vw">
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">MISSION DESIGNATION:</TerminalText>
            <TerminalInput
              value={config.name}
              onChange={(value) => onChange({ ...config, name: value })}
              placeholder="ENTER MISSION NAME"
              promptPrefix=">"
            />
          </div>

          <div>
            <TerminalText variant="bright">SECT ASSIGNMENT:</TerminalText>
            <TerminalSelect
              value={config.sect}
              onChange={(value) => onChange({ ...config, sect: value })}
              options={[
                { value: 'preservers', label: 'PRESERVERS' },
                { value: 'adaptors', label: 'ADAPTORS' },
                { value: 'wanderers', label: 'WANDERERS' }
              ]}
            />
          </div>

          <div>
            <TerminalText variant="bright">MISSION OBJECTIVE:</TerminalText>
            <TerminalSelect
              value={config.objective}
              onChange={(value) => onChange({ ...config, objective: value })}
              options={[
                { value: 'colonization', label: 'COLONIZATION' },
                { value: 'mining', label: 'RESOURCE MINING' },
                { value: 'exploration', label: 'DEEP SPACE EXPLORATION' },
                { value: 'rescue', label: 'RESCUE OPERATION' }
              ]}
            />
          </div>

          <div className="terminal-grid cols-2">
            <div>
              <TerminalText variant="bright">VESSEL SIZE:</TerminalText>
              <TerminalSelect
                value={config.shipSize}
                onChange={(value) => onChange({ ...config, shipSize: value })}
                options={[
                  { value: 'medium', label: 'MEDIUM (15K)' },
                  { value: 'large', label: 'LARGE (30K)' },
                  { value: 'massive', label: 'MASSIVE (50K)' },
                  { value: 'gigantic', label: 'GIGANTIC (80K)' }
                ]}
              />
            </div>

            <div>
              <TerminalText variant="bright">DURATION (YEARS):</TerminalText>
              <TerminalInput
                type="number"
                value={config.estimatedDuration.toString()}
                onChange={(value) => onChange({ ...config, estimatedDuration: parseInt(value) || 200 })}
                promptPrefix=">"
              />
            </div>
          </div>
        </div>

        <div className="terminal-flex gap-3 mt-6">
          <TerminalButton
            onClick={onCancel}
            variant="error"
            fullWidth
          >
            ABORT
          </TerminalButton>
          <TerminalButton
            onClick={onConfirm}
            disabled={!config.name}
            variant="success"
            fullWidth
          >
            LAUNCH MISSION
          </TerminalButton>
        </div>
      </TerminalWindow>
    </div>
  );
};