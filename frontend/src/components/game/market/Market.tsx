import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const Market: React.FC = () => {
  const { resources, market, tradeResource } = useGameStore();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return '↗️';
      case 'falling':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-red-400';
      case 'falling':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleTrade = (resource: 'minerals' | 'energy' | 'food' | 'influence', action: 'buy' | 'sell') => {
    tradeResource(resource, action);
  };

  const canBuy = (resource: 'minerals' | 'energy' | 'food' | 'influence') => {
    const price = market.prices[resource];
    return resources.credits >= price * 10;
  };

  const canSell = (resource: 'minerals' | 'energy' | 'food' | 'influence') => {
    return resources[resource] >= 10;
  };

  const marketItems = [
    { key: 'minerals' as const, name: 'Minerals', icon: '⛏️' },
    { key: 'energy' as const, name: 'Energy', icon: '⚡' },
    { key: 'food' as const, name: 'Food', icon: '🍎' },
  ];

  return (
    <div className="market-interface grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market Prices */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Galactic Market</h3>
        <div className="space-y-4">
          {marketItems.map((item) => (
            <div key={item.key} className="market-item flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-300">
                    {market.prices[item.key]} Credits
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-sm ${getTrendColor(market.trends[item.key])}`}>
                  {getTrendIcon(market.trends[item.key])} {market.trends[item.key]}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  className={`btn btn--sm ${canBuy(item.key) ? 'btn--primary' : 'btn--outline opacity-50 cursor-not-allowed'}`}
                  onClick={() => handleTrade(item.key, 'buy')}
                  disabled={!canBuy(item.key)}
                >
                  Buy 10
                </button>
                <button
                  className={`btn btn--sm ${canSell(item.key) ? 'btn--secondary' : 'btn--outline opacity-50 cursor-not-allowed'}`}
                  onClick={() => handleTrade(item.key, 'sell')}
                  disabled={!canSell(item.key)}
                >
                  Sell 10
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Contracts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Available Contracts</h3>
        <div className="space-y-4">
          <div className="contract-item p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2">Mining Survey</h4>
            <p className="text-sm text-gray-300 mb-3">
              Survey asteroid belt for rare minerals
            </p>
            <div className="contract-reward text-sm text-green-400 mb-3">
              Reward: 300 Credits, 50 Minerals
            </div>
            <button className="btn btn--primary btn--sm w-full">
              Accept Contract
            </button>
          </div>

          <div className="contract-item p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2">Trade Escort</h4>
            <p className="text-sm text-gray-300 mb-3">
              Escort merchant vessel through pirate territory
            </p>
            <div className="contract-reward text-sm text-green-400 mb-3">
              Reward: 500 Credits, +10 Military Rep
            </div>
            <button className="btn btn--primary btn--sm w-full">
              Accept Contract
            </button>
          </div>

          <div className="contract-item p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2">Research Mission</h4>
            <p className="text-sm text-gray-300 mb-3">
              Study ancient alien artifacts
            </p>
            <div className="contract-reward text-sm text-green-400 mb-3">
              Reward: 400 Credits, +15 Science Rep
            </div>
            <button className="btn btn--primary btn--sm w-full">
              Accept Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;