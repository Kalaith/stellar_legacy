// hooks/useTradeActions.ts
import { useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';

export const useTradeActions = () => {
  const { resources, market, showNotification } = useGameStore();

  const tradeResource = useCallback((resource: 'minerals' | 'energy' | 'food' | 'influence', action: 'buy' | 'sell') => {
    const price = market.prices[resource];
    const amount = 10;

    if (action === 'buy') {
      const cost = price * amount;
      if (resources.credits >= cost) {
        const newResources = {
          ...resources,
          credits: resources.credits - cost,
          [resource]: resources[resource] + amount
        };
        useGameStore.setState({ resources: newResources });
        showNotification(`Bought ${amount} ${resource} for ${cost} credits`, 'success');
      } else {
        showNotification('Not enough credits!', 'error');
      }
    } else {
      if (resources[resource] >= amount) {
        const earnings = price * amount;
        const newResources = {
          ...resources,
          [resource]: resources[resource] - amount,
          credits: resources.credits + earnings
        };
        useGameStore.setState({ resources: newResources });
        showNotification(`Sold ${amount} ${resource} for ${earnings} credits`, 'success');
      } else {
        showNotification(`Not enough ${resource}!`, 'error');
      }
    }
  }, [resources, market.prices, showNotification]);

  return { tradeResource };
};