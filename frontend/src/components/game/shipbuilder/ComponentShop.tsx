// components/game/shipbuilder/ComponentShop.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';
import { UI_CONSTANTS } from '../../../constants/uiConstants';

const ComponentShop: React.FC = React.memo(() => {
  const { shipComponents, currentComponentCategory, resources } = useGameStore();
  const { handlePurchaseComponent, handleSwitchComponentCategory } = useGameActions();

  const categories = useMemo(() => [
    { id: 'hulls', label: 'Hulls' },
    { id: 'engines', label: 'Engines' },
    { id: 'weapons', label: 'Weapons' }
  ] as const, []);

  const currentComponents = shipComponents[currentComponentCategory];

  const canAfford = useCallback((cost: any) => {
    return Object.entries(cost).every(([resource, amount]: [string, any]) =>
      resources[resource as keyof typeof resources] >= amount
    );
  }, [resources]);

  const formatCost = useCallback((cost: any) => {
    return Object.entries(cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ');
  }, []);

  const handleCategorySwitch = useCallback((categoryId: string) => {
    handleSwitchComponentCategory(categoryId as any);
  }, [handleSwitchComponentCategory]);

  const handleComponentPurchase = useCallback((componentName: string) => {
    handlePurchaseComponent(currentComponentCategory, componentName);
  }, [handlePurchaseComponent, currentComponentCategory]);

  return (
    <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
      <h3 className={`text-xl font-bold ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} ${UI_CONSTANTS.SPACING.SECTION_MARGIN}`}>Available Components</h3>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategorySwitch(category.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              currentComponentCategory === category.id
                ? `${UI_CONSTANTS.COLORS.BG_SUCCESS} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                : `${UI_CONSTANTS.COLORS.BG_SECONDARY} ${UI_CONSTANTS.COLORS.TEXT_SECONDARY} ${UI_CONSTANTS.COLORS.HOVER_BG_TERTIARY}`
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div className="space-y-3">
        {currentComponents.map(component => (
          <div key={component.name} className={`${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className={`${UI_CONSTANTS.COLORS.TEXT_PRIMARY} font-semibold`}>{component.name}</h4>
              <button
                onClick={() => handleComponentPurchase(component.name)}
                disabled={!canAfford(component.cost)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  canAfford(component.cost)
                    ? `${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                    : `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.TEXT_MUTED} cursor-not-allowed`
                }`}
              >
                {canAfford(component.cost) ? 'Purchase' : 'Cannot Afford'}
              </button>
            </div>

            <div className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_MUTED} mb-2`}>
              Cost: {formatCost(component.cost)}
            </div>

            {component.stats && Object.keys(component.stats).length > 0 && (
              <div className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
                Stats: {Object.entries(component.stats).map(([stat, value]) =>
                  `${stat}: +${value}`
                ).join(', ')}
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