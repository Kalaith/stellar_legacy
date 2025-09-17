// components/game/shipbuilder/ShipDesign.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const ShipDesign: React.FC = React.memo(() => {
  const { ship } = useGameStore();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Ship Design</h3>

      <div className="space-y-4">
        <div className="text-center">
          <div className="w-48 h-32 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-6xl">🚀</div>
          </div>
          <h4 className="text-lg text-white font-semibold">{ship.name}</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Hull</div>
            <div className="text-white font-medium">{ship.hull}</div>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Engine</div>
            <div className="text-white font-medium">{ship.components.engine}</div>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Cargo</div>
            <div className="text-white font-medium">{ship.components.cargo}</div>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Weapons</div>
            <div className="text-white font-medium">{ship.components.weapons}</div>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Research</div>
            <div className="text-white font-medium">{ship.components.research}</div>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <div className="text-sm text-slate-400">Quarters</div>
            <div className="text-white font-medium">{ship.components.quarters}</div>
          </div>
        </div>

        <div className="bg-slate-700 rounded p-4">
          <h4 className="text-white font-semibold mb-2">Ship Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Speed: <span className="text-teal-400">{ship.stats.speed}</span></div>
            <div>Cargo: <span className="text-teal-400">{ship.stats.cargo}</span></div>
            <div>Combat: <span className="text-teal-400">{ship.stats.combat}</span></div>
            <div>Research: <span className="text-teal-400">{ship.stats.research}</span></div>
            <div>Crew Capacity: <span className="text-teal-400">{ship.stats.crewCapacity}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
});

ShipDesign.displayName = 'ShipDesign';

export default ShipDesign;