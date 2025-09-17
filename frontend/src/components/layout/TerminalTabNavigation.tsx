// components/layout/TerminalTabNavigation.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGenerationalMissionStore } from '../../stores/useGenerationalMissionStore';
import type { TabIdType } from '../../types/enums';

const TerminalTabNavigation: React.FC = React.memo(() => {
  const { currentTab, switchTab } = useGameStore();
  const { activeMissions } = useGenerationalMissionStore();

  const tabs = useMemo(() => [
    { id: 'dashboard' as TabIdType, label: 'DASHBOARD', category: 'CORE' },
    { id: 'ship-builder' as TabIdType, label: 'SHIP BUILDER', category: 'CORE' },
    { id: 'crew-quarters' as TabIdType, label: 'CREW QUARTERS', category: 'CORE' },
    { id: 'galaxy-map' as TabIdType, label: 'GALAXY MAP', category: 'CORE' },
    { id: 'market' as TabIdType, label: 'MARKET', category: 'CORE' },
    { id: 'legacy' as TabIdType, label: 'LEGACY', category: 'CORE' },
    { id: 'mission-command' as TabIdType, label: 'MISSION COMMAND', category: 'GENERATIONAL', alert: activeMissions.length > 0 },
    { id: 'dynasty-hall' as TabIdType, label: 'DYNASTY HALL', category: 'GENERATIONAL' },
    { id: 'sect-relations' as TabIdType, label: 'SECT RELATIONS', category: 'GENERATIONAL' },
    { id: 'cultural-evolution' as TabIdType, label: 'CULTURAL EVOLUTION', category: 'GENERATIONAL' }
  ], [activeMissions.length]);

  const handleTabSwitch = useCallback((tabId: TabIdType) => {\n    switchTab(tabId);\n  }, [switchTab]);

  const coreTabsWidth = 50;\n  const genTabsWidth = 60;

  return (\n    <nav className=\"terminal-navigation\">\n      {/* Core Systems Section */}\n      <div className=\"terminal-nav-section\">\n        <div className=\"terminal-nav-header\">\n          ┌─[CORE SYSTEMS]{\"─\".repeat(coreTabsWidth - 15)}┐\n        </div>\n        <div className=\"terminal-nav-content\">\n          <div className=\"terminal-nav-grid\">\n            {tabs.filter(tab => tab.category === 'CORE').map((tab, index) => {\n              const isActive = currentTab === tab.id;\n              const tabDisplay = tab.label.padEnd(15);\n              \n              return (\n                <button\n                  key={tab.id}\n                  onClick={() => handleTabSwitch(tab.id)}\n                  className={`terminal-nav-item ${\n                    isActive ? 'active' : 'inactive'\n                  }`}\n                >\n                  │ {isActive ? '►' : ' '} {tabDisplay} │\n                </button>\n              );\n            })}\n          </div>\n        </div>\n        <div className=\"terminal-nav-footer\">\n          └{\"─\".repeat(coreTabsWidth)}┘\n        </div>\n      </div>\n\n      {/* Generational Systems Section */}\n      <div className=\"terminal-nav-section\">\n        <div className=\"terminal-nav-header\">\n          ┌─[GENERATIONAL SYSTEMS]{\"─\".repeat(genTabsWidth - 23)}┐\n        </div>\n        <div className=\"terminal-nav-content\">\n          <div className=\"terminal-nav-grid\">\n            {tabs.filter(tab => tab.category === 'GENERATIONAL').map((tab, index) => {\n              const isActive = currentTab === tab.id;\n              const hasAlert = tab.alert;\n              const tabDisplay = tab.label.padEnd(20);\n              \n              return (\n                <button\n                  key={tab.id}\n                  onClick={() => handleTabSwitch(tab.id)}\n                  className={`terminal-nav-item ${\n                    isActive ? 'active' : 'inactive'\n                  } ${\n                    hasAlert ? 'alert' : ''\n                  }`}\n                >\n                  │ {isActive ? '►' : ' '} {tabDisplay} {hasAlert ? '[!]' : '   '} │\n                </button>\n              );\n            })}\n          </div>\n        </div>\n        <div className=\"terminal-nav-footer\">\n          └{\"─\".repeat(genTabsWidth)}┘\n        </div>\n      </div>\n\n      {/* Command Line Indicator */}\n      <div className=\"terminal-command-line\">\n        <div className=\"terminal-text dim\">\n          CURRENT SYSTEM: [{currentTab.toUpperCase().replace('-', '_')}] │ AWAITING COMMANDS...\n        </div>\n      </div>\n    </nav>\n  );\n});

TerminalTabNavigation.displayName = 'TerminalTabNavigation';

export default TerminalTabNavigation;