// hooks/useTabNavigation.ts
import { useMemo, useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useGenerationalMissionStore } from '../stores/useGenerationalMissionStore';
import type { TabIdType } from '../types/enums';

interface TabDefinition {
  id: TabIdType;
  label: string;
  category: 'CORE' | 'GENERATIONAL';
  alert?: boolean;
}

const createTabDefinitions = (activeMissionCount: number): TabDefinition[] => [
  { id: 'dashboard' as TabIdType, label: 'DASHBOARD', category: 'CORE' },
  { id: 'ship-builder' as TabIdType, label: 'SHIP BUILDER', category: 'CORE' },
  { id: 'crew-quarters' as TabIdType, label: 'CREW QUARTERS', category: 'CORE' },
  { id: 'galaxy-map' as TabIdType, label: 'GALAXY MAP', category: 'CORE' },
  { id: 'market' as TabIdType, label: 'MARKET', category: 'CORE' },
  { id: 'legacy' as TabIdType, label: 'LEGACY', category: 'CORE' },
  {
    id: 'mission-command' as TabIdType,
    label: 'MISSION COMMAND',
    category: 'GENERATIONAL',
    alert: activeMissionCount > 0
  },
  { id: 'dynasty-hall' as TabIdType, label: 'DYNASTY HALL', category: 'GENERATIONAL' },
  { id: 'legacy-relations' as TabIdType, label: 'LEGACY RELATIONS', category: 'GENERATIONAL' },
  { id: 'cultural-evolution' as TabIdType, label: 'CULTURAL EVOLUTION', category: 'GENERATIONAL' },
  { id: 'chronicle' as TabIdType, label: 'CHRONICLE', category: 'GENERATIONAL' }
];

export const useTabNavigation = () => {
  const { currentTab, switchTab } = useGameStore();
  const { activeMissions } = useGenerationalMissionStore();

  const tabs = useMemo(() =>
    createTabDefinitions(activeMissions.length),
    [activeMissions.length]
  );

  const coreSystemTabs = useMemo(() =>
    tabs.filter(tab => tab.category === 'CORE'),
    [tabs]
  );

  const generationalTabs = useMemo(() =>
    tabs.filter(tab => tab.category === 'GENERATIONAL'),
    [tabs]
  );

  const handleTabSwitch = useCallback((tabId: TabIdType) => {
    switchTab(tabId);
  }, [switchTab]);

  return {
    currentTab,
    coreSystemTabs,
    generationalTabs,
    handleTabSwitch
  };
};