// components/layout/TerminalHeader.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { TerminalText } from '../ui/TerminalWindow';

const TerminalHeader: React.FC = () => {
  const { resources, ship, legacy } = useGameStore();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusColor = (value: number, threshold: number) => {
    if (value < threshold * 0.3) return 'error';
    if (value < threshold * 0.6) return 'warning';
    return 'success';
  };

  return (
    <header className="terminal-header-main">
      {/* ASCII Art Title */}
      <div className="terminal-title-section">
        <div className="terminal-ascii-title">
          <pre className="terminal-text bright">
{`
╔═══════════════════════════════════════════════════════════════╗
║   ███████╗████████╗███████╗██╗     ██╗      █████╗ ██████╗   ║
║   ██╔════╝╚══██╔══╝██╔════╝██║     ██║     ██╔══██╗██╔══██╗  ║
║   ███████╗   ██║   █████╗  ██║     ██║     ███████║██████╔╝  ║
║   ╚════██║   ██║   ██╔══╝  ██║     ██║     ██╔══██║██╔══██╗  ║
║   ███████║   ██║   ███████╗███████╗███████╗██║  ██║██║  ██║  ║
║   ╚══════╝   ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝  ║
║                    LEGACY COMMAND INTERFACE                  ║
╚═══════════════════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="terminal-status-bar">
        <div className="terminal-status-section">
          ┌─[SYSTEM STATUS]─────────────────────────────────────────────────────────────┐
        </div>

        <div className="terminal-status-grid">
          {/* Ship Info */}
          <div className="terminal-status-item">
            │ VESSEL: {ship.name.toUpperCase().padEnd(20)} │
          </div>

          <div className="terminal-status-item">
            │ HULL: {ship.hull.toUpperCase().padEnd(22)} │
          </div>

          <div className="terminal-status-item">
            │ LEGACY: {legacy.familyName.toUpperCase()} GEN-{legacy.generation.toString().padStart(2, '0')}{' '.repeat(10)} │
          </div>
        </div>

        <div className="terminal-status-section">
          ├─[RESOURCE MANIFEST]───────────────────────────────────────────────────────┤
        </div>

        {/* Resource Display */}
        <div className="terminal-resource-grid">
          <div className="terminal-resource-item">
            │ CREDITS: <TerminalText variant={getStatusColor(resources.credits, 5000)}>
              {formatNumber(resources.credits).padStart(8)}
            </TerminalText> │
          </div>

          <div className="terminal-resource-item">
            │ ENERGY:  <TerminalText variant={getStatusColor(resources.energy, 1000)}>
              {formatNumber(resources.energy).padStart(8)}
            </TerminalText> │
          </div>

          <div className="terminal-resource-item">
            │ MINERAL: <TerminalText variant={getStatusColor(resources.minerals, 500)}>
              {formatNumber(resources.minerals).padStart(8)}
            </TerminalText> │
          </div>

          <div className="terminal-resource-item">
            │ FOOD:    <TerminalText variant={getStatusColor(resources.food, 800)}>
              {formatNumber(resources.food).padStart(8)}
            </TerminalText> │
          </div>

          <div className="terminal-resource-item">
            │ INFLUENCE: <TerminalText variant={getStatusColor(resources.influence, 200)}>
              {formatNumber(resources.influence).padStart(6)}
            </TerminalText> │
          </div>
        </div>

        <div className="terminal-status-section">
          └─────────────────────────────────────────────────────────────────────────────┘
        </div>
      </div>

      {/* System Time and Status */}
      <div className="terminal-system-info">
        <div className="terminal-flex between">
          <div className="terminal-text dim">
            STARDATE: {new Date().toISOString().split('T')[0].replace(/-/g, '.')}
          </div>
          <div className="terminal-text dim">
            COORD: [CLASSIFIED]
          </div>
          <div className="terminal-text success">
            STATUS: OPERATIONAL
          </div>
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;