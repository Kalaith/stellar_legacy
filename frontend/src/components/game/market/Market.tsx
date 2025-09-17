import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';

const Market: React.FC = () => {
  const { resources, market, tradeResource } = useGameStore();

  const getTrendIcon = useMemo(() => (trend: string) => {
    switch (trend) {
      case 'rising':
        return '↗️';
      case 'falling':
        return '↘️';
      default:
        return '➡️';
    }
  }, []);

  const getTrendColor = useMemo(() => (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-red-400';
      case 'falling':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  }, []);

  const handleTrade = useCallback((resource: 'minerals' | 'energy' | 'food' | 'influence', action: 'buy' | 'sell') => {
    tradeResource(resource, action);
  }, [tradeResource]);

  const canBuy = useCallback((resource: 'minerals' | 'energy' | 'food' | 'influence') => {
    const price = market.prices[resource];
    return resources.credits >= price * 10;
  }, [market.prices, resources.credits]);

  const canSell = useCallback((resource: 'minerals' | 'energy' | 'food' | 'influence') => {
    return resources[resource] >= 10;
  }, [resources]);

  const marketItems = useMemo(() => [
    { key: 'minerals' as const, name: 'Minerals', icon: '⛏️' },
    { key: 'energy' as const, name: 'Energy', icon: '⚡' },
    { key: 'food' as const, name: 'Food', icon: '🍎' },
  ], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Market Prices */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Galactic Market</h3>
        <div className="space-y-4">
          {marketItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-sm text-slate-300">
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
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    canBuy(item.key)
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                  onClick={() => handleTrade(item.key, 'buy')}
                  disabled={!canBuy(item.key)}
                >
                  Buy 10
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    canSell(item.key)
                      ? 'bg-slate-600 hover:bg-slate-700 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
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
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Available Contracts</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Mining Survey</h4>
            <p className="text-sm text-slate-300 mb-3">
              Survey asteroid belt for rare minerals
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 300 Credits, 50 Minerals
            </div>
            <button className="w-full px-3 py-2 rounded text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white transition-colors">
              Accept Contract
            </button>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Trade Escort</h4>
            <p className="text-sm text-slate-300 mb-3">
              Escort merchant vessel through pirate territory
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 500 Credits, +10 Military Rep
            </div>
            <button className="w-full px-3 py-2 rounded text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white transition-colors">
              Accept Contract
            </button>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Research Mission</h4>
            <p className="text-sm text-slate-300 mb-3">
              Study ancient alien artifacts
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 400 Credits, +15 Science Rep
            </div>
            <button className="w-full px-3 py-2 rounded text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white transition-colors">
              Accept Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;