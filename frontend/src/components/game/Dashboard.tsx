// components/game/Dashboard.tsx
import React from 'react';
import ShipStatus from './dashboard/ShipStatus';
import CrewSummary from './dashboard/CrewSummary';
import EmpireOverview from './dashboard/EmpireOverview';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2">
        <ShipStatus />
      </div>
      <div className="space-y-6">
        <CrewSummary />
        <EmpireOverview />
      </div>
    </div>
  );
};

export default Dashboard;