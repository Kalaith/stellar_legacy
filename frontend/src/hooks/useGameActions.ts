// hooks/useGameActions.ts
import { useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import type { ShipComponentsData } from '../types/game';
import type { CrewMemberId } from '../types/branded';

export const useGameActions = () => {
  const store = useGameStore();

  const handleTrainCrew = useCallback(() => {
    store.trainCrew();
  }, [store]);

  const handleBoostMorale = useCallback(() => {
    store.boostMorale();
  }, [store]);

  const handleRecruitCrew = useCallback(() => {
    store.recruitCrew();
  }, [store]);

  const handleExploreSystem = useCallback(() => {
    store.exploreSystem();
  }, [store]);

  const handleEstablishColony = useCallback(() => {
    store.establishColony();
  }, [store]);

  const handlePurchaseComponent = useCallback(
    (category: string, componentName: string) => {
      store.purchaseComponent(category, componentName);
    },
    [store]
  );

  const handleSelectHeir = useCallback(
    (heirId: CrewMemberId) => {
      store.selectHeir(heirId);
    },
    [store]
  );

  const handleSwitchComponentCategory = useCallback(
    (category: keyof ShipComponentsData) => {
      store.switchComponentCategory(category);
    },
    [store]
  );

  return {
    handleTrainCrew,
    handleBoostMorale,
    handleRecruitCrew,
    handleExploreSystem,
    handleEstablishColony,
    handlePurchaseComponent,
    handleSelectHeir,
    handleSwitchComponentCategory,
  };
};
