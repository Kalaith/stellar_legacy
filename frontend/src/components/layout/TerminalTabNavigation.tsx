// components/layout/TerminalTabNavigation.tsx
import React from 'react';
import { useTabNavigation } from '../../hooks/useTabNavigation';
import { UI_CONSTANTS } from '../../constants/uiConstants';

const TerminalTabNavigation: React.FC = React.memo(() => {
  const { currentTab, coreSystemTabs, generationalTabs, handleTabSwitch } = useTabNavigation();

  const coreTabsWidth = UI_CONSTANTS.NAVIGATION.CORE_TABS_WIDTH;
  const genTabsWidth = UI_CONSTANTS.NAVIGATION.GENERATIONAL_TABS_WIDTH;

  return (
    <nav className="terminal-navigation">
      {/* Core Systems Section */}
      <div className="terminal-nav-section">
        <div className="terminal-nav-header">
          ┌─[CORE SYSTEMS]{"─".repeat(coreTabsWidth - UI_CONSTANTS.NAVIGATION.CORE_SYSTEMS_HEADER_LENGTH)}┐
        </div>
        <div className="terminal-nav-content">
          <div className="terminal-nav-grid">
            {coreSystemTabs.map((tab, index) => {
              const isActive = currentTab === tab.id;
              const tabDisplay = tab.label.padEnd(UI_CONSTANTS.NAVIGATION.TAB_LABEL_PADDING.CORE);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${
                    isActive ? 'active' : 'inactive'
                  }`}
                >
                  │ {isActive ? '►' : ' '} {tabDisplay} │
                </button>
              );
            })}
          </div>
        </div>
        <div className="terminal-nav-footer">
          └{"─".repeat(coreTabsWidth)}┘
        </div>
      </div>

      {/* Generational Systems Section */}
      <div className="terminal-nav-section">
        <div className="terminal-nav-header">
          ┌─[GENERATIONAL SYSTEMS]{"─".repeat(genTabsWidth - UI_CONSTANTS.NAVIGATION.GENERATIONAL_SYSTEMS_HEADER_LENGTH)}┐
        </div>
        <div className="terminal-nav-content">
          <div className="terminal-nav-grid">
            {generationalTabs.map((tab, index) => {
              const isActive = currentTab === tab.id;
              const hasAlert = tab.alert;
              const tabDisplay = tab.label.padEnd(UI_CONSTANTS.NAVIGATION.TAB_LABEL_PADDING.GENERATIONAL);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`terminal-nav-item ${
                    isActive ? 'active' : 'inactive'
                  } ${
                    hasAlert ? 'alert' : ''
                  }`}
                >
                  │ {isActive ? '►' : ' '} {tabDisplay} {hasAlert ? '[!]' : '   '} │
                </button>
              );
            })}
          </div>
        </div>
        <div className="terminal-nav-footer">
          └{"─".repeat(genTabsWidth)}┘
        </div>
      </div>

      {/* Command Line Indicator */}
      <div className="terminal-command-line">
        <div className="terminal-text dim">
          CURRENT SYSTEM: [{currentTab.toUpperCase().replace('-', '_')}] │ AWAITING COMMANDS...
        </div>
      </div>
    </nav>
  );
});

TerminalTabNavigation.displayName = 'TerminalTabNavigation';

export default TerminalTabNavigation;