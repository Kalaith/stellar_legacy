// components/game/TerminalDashboard.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGenerationalMissionStore } from '../../stores/useGenerationalMissionStore';
import {
  TerminalWindow,
  TerminalText,
  TerminalButton,
  TerminalProgress,
  TerminalTable,
} from '../ui/TerminalWindow';

const TerminalDashboard: React.FC = () => {
  const { resources, ship, crew, legacy, starSystems } = useGameStore();
  const { missions, activeMissions } = useGenerationalMissionStore();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSystemsStatus = () => {
    const explored = starSystems.filter(s => s.status === 'explored').length;
    const total = starSystems.length;
    return { explored, total, percentage: (explored / total) * 100 };
  };

  const getCrewMorale = () => {
    if (crew.length === 0) return 0;
    return crew.reduce((sum, member) => sum + member.morale, 0) / crew.length;
  };

  const systemsStatus = getSystemsStatus();
  const avgCrewMorale = getCrewMorale();
  const activeMissionsList = missions.filter(m =>
    activeMissions.includes(m.id)
  );

  return (
    <div className="terminal-grid responsive">
      {/* Ship Status Terminal */}
      <TerminalWindow title="SHIP STATUS" statusLine="OPERATIONAL" isActive>
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">VESSEL DESIGNATION:</TerminalText>
            <div className="terminal-text">{ship.name}</div>
          </div>

          <div>
            <TerminalText variant="bright">HULL CLASS:</TerminalText>
            <div className="terminal-text">{ship.hull}</div>
          </div>

          <div>
            <TerminalText variant="bright">SHIP STATISTICS:</TerminalText>
            <div className="terminal-space-y-sm">
              <TerminalProgress
                label="SPEED"
                value={ship.stats.speed}
                max={10}
                ascii
                variant="primary"
              />
              <TerminalProgress
                label="CARGO"
                value={ship.stats.cargo}
                max={500}
                ascii
                variant="primary"
              />
              <TerminalProgress
                label="COMBAT"
                value={ship.stats.combat}
                max={10}
                ascii
                variant="warning"
              />
              <TerminalProgress
                label="RESEARCH"
                value={ship.stats.research}
                max={10}
                ascii
                variant="success"
              />
            </div>
          </div>

          <div>
            <TerminalText variant="bright">CREW CAPACITY:</TerminalText>
            <div className="terminal-text">
              {crew.length}/{ship.stats.crewCapacity} PERSONNEL
            </div>
            <TerminalProgress
              value={crew.length}
              max={ship.stats.crewCapacity}
              ascii
              variant={
                crew.length >= ship.stats.crewCapacity * 0.9
                  ? 'warning'
                  : 'success'
              }
            />
          </div>
        </div>
      </TerminalWindow>

      {/* Resource Management Terminal */}
      <TerminalWindow
        title="RESOURCE MANAGEMENT"
        statusLine="MONITORING"
        isActive
      >
        <div className="terminal-space-y">
          <TerminalTable
            headers={['RESOURCE', 'QUANTITY', 'STATUS']}
            rows={[
              [
                'CREDITS',
                formatNumber(resources.credits),
                <TerminalText
                  variant={
                    resources.credits > 5000
                      ? 'success'
                      : resources.credits > 1000
                        ? 'warning'
                        : 'error'
                  }
                >
                  {resources.credits > 5000
                    ? 'OPTIMAL'
                    : resources.credits > 1000
                      ? 'LOW'
                      : 'CRITICAL'}
                </TerminalText>,
              ],
              [
                'ENERGY',
                formatNumber(resources.energy),
                <TerminalText
                  variant={
                    resources.energy > 1000
                      ? 'success'
                      : resources.energy > 500
                        ? 'warning'
                        : 'error'
                  }
                >
                  {resources.energy > 1000
                    ? 'OPTIMAL'
                    : resources.energy > 500
                      ? 'LOW'
                      : 'CRITICAL'}
                </TerminalText>,
              ],
              [
                'MINERALS',
                formatNumber(resources.minerals),
                <TerminalText
                  variant={
                    resources.minerals > 500
                      ? 'success'
                      : resources.minerals > 200
                        ? 'warning'
                        : 'error'
                  }
                >
                  {resources.minerals > 500
                    ? 'OPTIMAL'
                    : resources.minerals > 200
                      ? 'LOW'
                      : 'CRITICAL'}
                </TerminalText>,
              ],
              [
                'FOOD',
                formatNumber(resources.food),
                <TerminalText
                  variant={
                    resources.food > 800
                      ? 'success'
                      : resources.food > 400
                        ? 'warning'
                        : 'error'
                  }
                >
                  {resources.food > 800
                    ? 'OPTIMAL'
                    : resources.food > 400
                      ? 'LOW'
                      : 'CRITICAL'}
                </TerminalText>,
              ],
              [
                'INFLUENCE',
                formatNumber(resources.influence),
                <TerminalText
                  variant={
                    resources.influence > 200
                      ? 'success'
                      : resources.influence > 100
                        ? 'warning'
                        : 'error'
                  }
                >
                  {resources.influence > 200
                    ? 'OPTIMAL'
                    : resources.influence > 100
                      ? 'LOW'
                      : 'CRITICAL'}
                </TerminalText>,
              ],
            ]}
          />
        </div>
      </TerminalWindow>

      {/* Exploration Status Terminal */}
      <TerminalWindow title="EXPLORATION STATUS" statusLine="MAPPING" isActive>
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">GALAXY EXPLORATION:</TerminalText>
            <div className="terminal-text">
              {systemsStatus.explored}/{systemsStatus.total} SYSTEMS MAPPED
            </div>
            <TerminalProgress
              value={systemsStatus.percentage}
              max={100}
              ascii
              variant="primary"
            />
          </div>

          <div>
            <TerminalText variant="bright">CREW MORALE:</TerminalText>
            <TerminalProgress
              value={avgCrewMorale}
              max={100}
              ascii
              variant={
                avgCrewMorale > 80
                  ? 'success'
                  : avgCrewMorale > 60
                    ? 'warning'
                    : 'error'
              }
            />
          </div>

          <div>
            <TerminalText variant="bright">RECENT DISCOVERIES:</TerminalText>
            <div className="terminal-list">
              {starSystems
                .filter(s => s.status === 'explored')
                .slice(-3)
                .map((system, index) => (
                  <div key={index} className="terminal-list-item">
                    {system.name.toUpperCase()} - {system.planets.length}{' '}
                    PLANETS
                  </div>
                ))}
              {systemsStatus.explored === 0 && (
                <div className="terminal-text dim">
                  NO RECENT EXPLORATION DATA
                </div>
              )}
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Legacy Information Terminal */}
      <TerminalWindow title="LEGACY RECORDS" statusLine="ARCHIVED" isActive>
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">FAMILY LINEAGE:</TerminalText>
            <div className="terminal-text">
              {legacy.familyName.toUpperCase()}
            </div>
          </div>

          <div>
            <TerminalText variant="bright">GENERATION:</TerminalText>
            <div className="terminal-text">
              GEN-{legacy.generation.toString().padStart(2, '0')}
            </div>
          </div>

          <div>
            <TerminalText variant="bright">ACHIEVEMENTS:</TerminalText>
            <div className="terminal-list">
              {legacy.achievements.map((achievement, index) => (
                <div key={index} className="terminal-list-item">
                  {achievement.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div>
            <TerminalText variant="bright">FAMILY TRAITS:</TerminalText>
            <div className="terminal-list">
              {legacy.traits.map((trait, index) => (
                <div key={index} className="terminal-list-item">
                  {trait.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div>
            <TerminalText variant="bright">REPUTATION:</TerminalText>
            <div className="terminal-space-y-sm">
              <TerminalProgress
                label="MILITARY"
                value={legacy.reputation.military}
                max={100}
                ascii
                variant="warning"
              />
              <TerminalProgress
                label="TRADERS"
                value={legacy.reputation.traders}
                max={100}
                ascii
                variant="success"
              />
              <TerminalProgress
                label="SCIENTISTS"
                value={legacy.reputation.scientists}
                max={100}
                ascii
                variant="primary"
              />
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Mission Status Terminal */}
      <TerminalWindow
        title="MISSION STATUS"
        statusLine={activeMissionsList.length > 0 ? 'ACTIVE' : 'STANDBY'}
        isActive
      >
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">ACTIVE MISSIONS:</TerminalText>
            <div className="terminal-text">
              {activeMissionsList.length} OPERATIONS
            </div>
          </div>

          {activeMissionsList.length > 0 ? (
            <div>
              <TerminalText variant="bright">CURRENT OPERATIONS:</TerminalText>
              <div className="terminal-list">
                {activeMissionsList.slice(0, 3).map((mission, index) => (
                  <div key={index} className="terminal-list-item">
                    {mission.name.toUpperCase()} -{' '}
                    {mission.legacy.toUpperCase()}
                    <div className="terminal-text dim">
                      YEAR {mission.currentYear}/{mission.estimatedDuration}
                    </div>
                  </div>
                ))}
                {activeMissionsList.length > 3 && (
                  <div className="terminal-text dim">
                    +{activeMissionsList.length - 3} MORE OPERATIONS
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <TerminalText variant="dim">
                NO ACTIVE GENERATIONAL MISSIONS
              </TerminalText>
              <div className="terminal-text dim">
                ACCESS MISSION COMMAND TO LAUNCH OPERATIONS
              </div>
            </div>
          )}

          <div>
            <TerminalText variant="bright">
              SYSTEM RECOMMENDATIONS:
            </TerminalText>
            <div className="terminal-list">
              {resources.credits < 1000 && (
                <div className="terminal-list-item terminal-text error">
                  CRITICAL: INSUFFICIENT CREDITS
                </div>
              )}
              {resources.energy < 500 && (
                <div className="terminal-list-item terminal-text error">
                  WARNING: LOW ENERGY RESERVES
                </div>
              )}
              {avgCrewMorale < 60 && (
                <div className="terminal-list-item terminal-text warning">
                  NOTICE: CREW MORALE DECLINING
                </div>
              )}
              {systemsStatus.explored < systemsStatus.total && (
                <div className="terminal-list-item terminal-text primary">
                  RECOMMEND: CONTINUE EXPLORATION
                </div>
              )}
              {activeMissionsList.length === 0 && (
                <div className="terminal-list-item terminal-text success">
                  AVAILABLE: LAUNCH GENERATIONAL MISSIONS
                </div>
              )}
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Command Interface Terminal */}
      <TerminalWindow
        title="COMMAND INTERFACE"
        statusLine="AWAITING INPUT"
        isActive
      >
        <div className="terminal-space-y">
          <div>
            <TerminalText variant="bright">QUICK ACTIONS:</TerminalText>
          </div>

          <div className="terminal-space-y-sm">
            <TerminalButton
              variant="primary"
              fullWidth
              onClick={() => {
                /* Navigate to crew quarters */
              }}
            >
              CREW MANAGEMENT
            </TerminalButton>

            <TerminalButton
              variant="success"
              fullWidth
              onClick={() => {
                /* Navigate to ship builder */
              }}
            >
              SHIP CONFIGURATION
            </TerminalButton>

            <TerminalButton
              variant="warning"
              fullWidth
              onClick={() => {
                /* Navigate to galaxy map */
              }}
            >
              EXPLORATION PROTOCOLS
            </TerminalButton>

            <TerminalButton
              variant="primary"
              fullWidth
              onClick={() => {
                /* Navigate to mission command */
              }}
            >
              MISSION COMMAND
            </TerminalButton>
          </div>

          <div>
            <TerminalText variant="bright">SYSTEM STATUS:</TerminalText>
            <div className="terminal-text success">ALL SYSTEMS OPERATIONAL</div>
            <div className="terminal-text dim">
              LAST UPDATE: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
};

export default TerminalDashboard;
