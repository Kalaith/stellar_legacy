import React, { useMemo, useState } from 'react';
import {
  TerminalButton,
  TerminalTable,
  TerminalText,
  TerminalWindow,
} from '../ui/TerminalWindow';
import {
  Phase1SimulationService,
  type Phase1SimulationState,
} from '../../services/Phase1SimulationService';

const PHASE1_SEED = 2201;

const getStatusVariant = (value: number): 'success' | 'warning' | 'error' => {
  if (value >= 70) return 'success';
  if (value >= 40) return 'warning';
  return 'error';
};

const Phase1VerticalSlice: React.FC = () => {
  const [simState, setSimState] = useState<Phase1SimulationState>(() =>
    Phase1SimulationService.createInitialState(PHASE1_SEED)
  );

  const currentLeader = simState.leaders[simState.currentLeaderIndex];

  const outcomeLabel = useMemo(
    () => Phase1SimulationService.getOutcomeLabel(simState.contract.outcome),
    [simState.contract.outcome]
  );

  return (
    <div className="terminal-grid responsive">
      <TerminalWindow title="PHASE 1 CONTROL" statusLine="VERTICAL SLICE" isActive>
        <div className="terminal-space-y">
          <div className="terminal-text">YEAR: {simState.time.year}</div>
          <div className="terminal-text">MONTH: {simState.time.month}</div>
          <div className="terminal-text">GENERATION: {simState.time.generation}</div>
          <div className="terminal-text">LEADER: {currentLeader?.name ?? 'Unknown'}</div>
          <div className="terminal-text">CONTRACT STATUS: {outcomeLabel}</div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <TerminalButton
              onClick={() => setSimState(prev => Phase1SimulationService.tickMonth(prev, PHASE1_SEED))}
              disabled={simState.isComplete}
            >
              ADVANCE MONTH
            </TerminalButton>
            <TerminalButton
              variant="success"
              onClick={() => setSimState(prev => Phase1SimulationService.tickYear(prev, PHASE1_SEED))}
              disabled={simState.isComplete}
            >
              ADVANCE YEAR
            </TerminalButton>
            <TerminalButton
              variant="warning"
              onClick={() => setSimState(Phase1SimulationService.createInitialState(PHASE1_SEED))}
            >
              RESET RUN
            </TerminalButton>
          </div>
        </div>
      </TerminalWindow>

      <TerminalWindow title="CORE ECONOMY" statusLine="FOOD / ENERGY / MATERIALS / CREDITS" isActive>
        <TerminalTable
          headers={['RESOURCE', 'VALUE']}
          rows={[
            ['FOOD', simState.resources.food],
            ['ENERGY', simState.resources.energy],
            ['MATERIALS', simState.resources.materials],
            ['CREDITS', simState.resources.credits],
          ]}
        />
      </TerminalWindow>

      <TerminalWindow title="SOCIETY + PROMISE TRACKER" statusLine="MORALE / STABILITY / EDUCATION" isActive>
        <div className="terminal-space-y">
          <div>
            <TerminalText variant={getStatusVariant(simState.society.morale)}>
              MORALE: {simState.society.morale}
            </TerminalText>
          </div>
          <div>
            <TerminalText variant={getStatusVariant(simState.society.stability)}>
              STABILITY: {simState.society.stability}
            </TerminalText>
          </div>
          <div>
            <TerminalText variant={getStatusVariant(simState.society.education)}>
              EDUCATION: {simState.society.education}
            </TerminalText>
          </div>

          <div className="terminal-text bright">ACTIVE PROMISES</div>
          <div className="terminal-list">
            {simState.activePromises.map(promise => (
              <div key={promise} className="terminal-list-item">
                {promise}
              </div>
            ))}
          </div>
          <div className="terminal-text bright">AT RISK / UNRESOLVED</div>
          <div className="terminal-list">
            {simState.unresolvedPromises.map(promise => (
              <div key={promise} className="terminal-list-item">
                {promise}
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      <TerminalWindow title="LEGACY HANDOVER" statusLine="INHERITANCE SNAPSHOTS" isActive>
        <TerminalTable
          headers={['YEAR', 'OUTGOING', 'INCOMING', 'DEBT', 'REPUTATION']}
          rows={simState.inheritanceHistory.map(snapshot => [
            snapshot.year,
            snapshot.outgoingLeaderId,
            snapshot.incomingLeaderId,
            snapshot.inheritedDebt,
            snapshot.inheritedReputation,
          ])}
        />
        {simState.inheritanceHistory.length === 0 && (
          <div className="terminal-text dim mt-2">NO HANDOVER YET - REACH YEAR 2220</div>
        )}
      </TerminalWindow>

      <TerminalWindow title="EVENT TIMELINE" statusLine="RECENT SHIP EVENTS" isActive>
        <TerminalTable
          headers={['Y', 'M', 'EVENT', 'EFFECT']}
          rows={simState.events.map(event => [
            event.year,
            event.month,
            event.title,
            event.effectSummary,
          ])}
        />
      </TerminalWindow>
    </div>
  );
};

export default Phase1VerticalSlice;
