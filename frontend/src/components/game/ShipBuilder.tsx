// components/game/ShipBuilder.tsx
import React from 'react';
import ComponentShop from './shipbuilder/ComponentShop';
import ShipDesign from './shipbuilder/ShipDesign';

const ShipBuilder: React.FC = React.memo(() => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <ShipDesign />
      <ComponentShop />
    </div>
  );
});

ShipBuilder.displayName = 'ShipBuilder';

export default ShipBuilder;