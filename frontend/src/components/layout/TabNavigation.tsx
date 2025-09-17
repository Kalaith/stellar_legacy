// components/layout/TabNavigation.tsx
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

const TabNavigation: React.FC = () => {
  const { currentTab, switchTab } = useGameStore();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'ship-builder', label: 'Ship Builder' },
    { id: 'crew-quarters', label: 'Crew Quarters' },
    { id: 'galaxy-map', label: 'Galaxy Map' },
    { id: 'market', label: 'Market' },
    { id: 'legacy', label: 'Legacy' },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6">
      <div className="flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              currentTab === tab.id
                ? 'bg-teal-600 text-white border-b-2 border-teal-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
