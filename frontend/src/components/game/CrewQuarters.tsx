// components/game/CrewQuarters.tsx
import React from 'react';
import CrewGrid from './crew/CrewGrid';
import CrewActions from './crew/CrewActions';

const CrewQuarters: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2">
        <CrewGrid />
      </div>
      <div>
        <CrewActions />
      </div>
    </div>
  );
};

export default CrewQuarters;
