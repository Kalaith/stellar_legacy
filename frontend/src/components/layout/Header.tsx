// components/layout/Header.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { uiConstants } from '../../constants/uiConstants';

const Header: React.FC = React.memo(() => {
  const { resources, legacy } = useGameStore();
  const captain = useGameStore(state => state.crew.find(c => c.role === 'Captain'));

  const captainName = useMemo(() => captain?.name.split(' ')[1] || 'Unknown', [captain?.name]);

  return (
    <header className={`${uiConstants.COLORS.BG_PRIMARY} border-b ${uiConstants.COLORS.BORDER} px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className={`text-2xl font-bold ${uiConstants.COLORS.TEXT_PRIMARY}`}>Stellar Legacy</h1>
            <p className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>
              Generation {legacy.generation} - Captain {captainName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <ResourceItem icon="💰" label="Credits" value={Math.floor(resources.credits)} />
            <ResourceItem icon="⚡" label="Energy" value={Math.floor(resources.energy)} />
            <ResourceItem icon="⛏️" label="Minerals" value={Math.floor(resources.minerals)} />
            <ResourceItem icon="🍎" label="Food" value={Math.floor(resources.food)} />
            <ResourceItem icon="🎖️" label="Influence" value={Number(resources.influence.toFixed(2))} />
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

interface ResourceItemProps {
  icon: string;
  label: string;
  value: number;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, label, value }) => (
  <div className={`flex items-center space-x-2 ${uiConstants.COLORS.BG_PRIMARY} px-3 py-2 rounded-lg`}>
    <span className="text-lg">{icon}</span>
    <div className="text-center">
      <div className={`text-xs ${uiConstants.COLORS.TEXT_MUTED}`}>{label}</div>
      <div className={`text-sm font-semibold ${uiConstants.COLORS.TEXT_PRIMARY}`}>{value}</div>
    </div>
  </div>
);

export default Header;