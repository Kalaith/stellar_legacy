// components/game/shipbuilder/ComponentShop.tsx
import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { useGameActions } from '../../../hooks/useGameActions';

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
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Available Components</h3>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategorySwitch(category.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              currentComponentCategory === category.id
                ? 'bg-teal-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div className="space-y-3">
        {currentComponents.map(component => (
          <div key={component.name} className="bg-slate-700 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-semibold">{component.name}</h4>
              <button
                onClick={() => handleComponentPurchase(component.name)}
                disabled={!canAfford(component.cost)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  canAfford(component.cost)
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canAfford(component.cost) ? 'Purchase' : 'Cannot Afford'}
              </button>
            </div>

            <div className="text-sm text-slate-400 mb-2">
              Cost: {formatCost(component.cost)}
            </div>

            {component.stats && Object.keys(component.stats).length > 0 && (
              <div className="text-sm text-slate-300">
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