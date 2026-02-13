// components/game/shipbuilder/ComponentShop.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';
import { uiConstants } from '../../../constants/uiConstants';
import type { ComponentCategoryType } from '../../../types/enums';
import type { ComponentCost } from '../../../types/game';

const ComponentShop: React.FC = React.memo(() => {
  const { shipComponents, currentComponentCategory, resources } =
    useGameStore();
  const { handlePurchaseComponent, handleSwitchComponentCategory } =
    useGameActions();

  const categories = useMemo(
    () =>
      [
        { id: 'hulls', label: 'Hulls' },
        { id: 'engines', label: 'Engines' },
        { id: 'weapons', label: 'Weapons' },
      ] as const,
    []
  );

  const currentComponents = shipComponents[currentComponentCategory];

  const canAfford = useCallback(
    (cost: ComponentCost) => {
      return (Object.keys(cost) as Array<keyof ComponentCost>).every(
        resource => {
          const amount = cost[resource];
          if (amount === undefined) return true;
          return resources[resource] >= amount;
        }
      );
    },
    [resources]
  );

  const formatCost = useCallback((cost: ComponentCost) => {
    return (Object.keys(cost) as Array<keyof ComponentCost>)
      .filter(resource => typeof cost[resource] === 'number')
      .map(resource => `${cost[resource]} ${resource}`)
      .join(', ');
  }, []);

  const handleCategorySwitch = useCallback(
    (categoryId: ComponentCategoryType) => {
      handleSwitchComponentCategory(categoryId);
    },
    [handleSwitchComponentCategory]
  );

  const handleComponentPurchase = useCallback(
    (componentName: string) => {
      handlePurchaseComponent(currentComponentCategory, componentName);
    },
    [handlePurchaseComponent, currentComponentCategory]
  );

  return (
    <div
      className={`${uiConstants.CARDS.BACKGROUND} ${uiConstants.CARDS.BASE} ${uiConstants.SPACING.CARD_PADDING} ${uiConstants.CARDS.BORDER}`}
    >
      <h3
        className={`text-xl font-bold ${uiConstants.COLORS.TEXT_PRIMARY} ${uiConstants.SPACING.SECTION_MARGIN}`}
      >
        Available Components
      </h3>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategorySwitch(category.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              currentComponentCategory === category.id
                ? `${uiConstants.COLORS.BG_SUCCESS} ${uiConstants.COLORS.TEXT_PRIMARY}`
                : `${uiConstants.COLORS.BG_SECONDARY} ${uiConstants.COLORS.TEXT_SECONDARY} ${uiConstants.COLORS.HOVER_BG_TERTIARY}`
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div className="space-y-3">
        {currentComponents.map(component => (
          <div
            key={component.name}
            className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4
                className={`${uiConstants.COLORS.TEXT_PRIMARY} font-semibold`}
              >
                {component.name}
              </h4>
              <button
                onClick={() => handleComponentPurchase(component.name)}
                disabled={!canAfford(component.cost)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  canAfford(component.cost)
                    ? `${uiConstants.COLORS.BG_SUCCESS} hover:bg-teal-700 ${uiConstants.COLORS.TEXT_PRIMARY}`
                    : `${uiConstants.COLORS.BG_TERTIARY} ${uiConstants.COLORS.TEXT_MUTED} cursor-not-allowed`
                }`}
              >
                {canAfford(component.cost) ? 'Purchase' : 'Cannot Afford'}
              </button>
            </div>

            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED} mb-2`}>
              Cost: {formatCost(component.cost)}
            </div>

            {component.stats && Object.keys(component.stats).length > 0 && (
              <div className={`text-sm ${uiConstants.COLORS.TEXT_SECONDARY}`}>
                Stats:{' '}
                {Object.entries(component.stats)
                  .map(([stat, value]) => `${stat}: +${value}`)
                  .join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ComponentShop.displayName = 'ComponentShop';

export default ComponentShop;
