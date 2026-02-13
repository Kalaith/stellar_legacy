// components/layout/TabNavigation.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { uiConstants } from '../../constants/uiConstants';
import type { TabIdType } from '../../types/enums';

const TabNavigation: React.FC = React.memo(() => {
  const { currentTab, switchTab } = useGameStore();

  const tabs = useMemo(
    () => [
      { id: 'dashboard' as TabIdType, label: 'Dashboard' },
      { id: 'ship-builder' as TabIdType, label: 'Ship Builder' },
      { id: 'crew-quarters' as TabIdType, label: 'Crew Quarters' },
      { id: 'galaxy-map' as TabIdType, label: 'Galaxy Map' },
      { id: 'market' as TabIdType, label: 'Market' },
      { id: 'legacy' as TabIdType, label: 'Legacy' },
      { id: 'mission-command' as TabIdType, label: 'Mission Command' },
      { id: 'dynasty-hall' as TabIdType, label: 'Dynasty Hall' },
      { id: 'legacy-relations' as TabIdType, label: 'Legacy Relations' },
      { id: 'cultural-evolution' as TabIdType, label: 'Cultural Evolution' },
    ],
    []
  );

  const handleTabSwitch = useCallback(
    (tabId: TabIdType) => {
      switchTab(tabId);
    },
    [switchTab]
  );

  return (
    <nav
      className={`${uiConstants.COLORS.BG_PRIMARY} border-b ${uiConstants.COLORS.BORDER} px-6`}
    >
      <div className="flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabSwitch(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              currentTab === tab.id
                ? `${uiConstants.COLORS.BG_SUCCESS} ${uiConstants.COLORS.TEXT_PRIMARY} border-b-2 border-teal-400`
                : `${uiConstants.COLORS.TEXT_MUTED} ${uiConstants.COLORS.HOVER_TEXT_PRIMARY} ${uiConstants.COLORS.HOVER_BG_SECONDARY}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
});

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;
