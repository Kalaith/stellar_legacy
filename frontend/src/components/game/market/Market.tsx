import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { UI_CONSTANTS } from '../../../constants/uiConstants';

const Market: React.FC = React.memo(() => {
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
        return UI_CONSTANTS.COLORS.TEXT_ERROR;
      case 'falling':
        return UI_CONSTANTS.COLORS.TEXT_SUCCESS;
      default:
        return UI_CONSTANTS.COLORS.TEXT_MUTED;
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
      <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
        <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN_SM} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Galactic Market</h3>
        <div className="space-y-4">
          {marketItems.map((item) => (
            <div key={item.key} className={`flex items-center justify-between p-4 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className={`font-medium ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{item.name}</div>
                  <div className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
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
                      ? `${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                      : `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.TEXT_MUTED} cursor-not-allowed`
                  }`}
                  onClick={() => handleTrade(item.key, 'buy')}
                  disabled={!canBuy(item.key)}
                >
                  Buy 10
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    canSell(item.key)
                      ? `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.HOVER_BG_SECONDARY} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`
                      : `${UI_CONSTANTS.COLORS.BG_TERTIARY} ${UI_CONSTANTS.COLORS.TEXT_MUTED} cursor-not-allowed`
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
      <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
        <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN_SM} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Available Contracts</h3>
        <div className="space-y-4">
          <div className={`p-4 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
            <h4 className={`font-medium mb-2 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Mining Survey</h4>
            <p className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY} mb-3`}>
              Survey asteroid belt for rare minerals
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 300 Credits, 50 Minerals
            </div>
            <button className={`w-full px-3 py-2 rounded text-sm font-medium ${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} transition-colors`}>
              Accept Contract
            </button>
          </div>

          <div className={`p-4 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
            <h4 className={`font-medium mb-2 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Trade Escort</h4>
            <p className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY} mb-3`}>
              Escort merchant vessel through pirate territory
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 500 Credits, +10 Military Rep
            </div>
            <button className={`w-full px-3 py-2 rounded text-sm font-medium ${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} transition-colors`}>
              Accept Contract
            </button>
          </div>

          <div className={`p-4 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
            <h4 className={`font-medium mb-2 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Research Mission</h4>
            <p className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY} mb-3`}>
              Study ancient alien artifacts
            </p>
            <div className="text-sm text-green-400 mb-3">
              Reward: 400 Credits, +15 Science Rep
            </div>
            <button className={`w-full px-3 py-2 rounded text-sm font-medium ${UI_CONSTANTS.COLORS.BG_SUCCESS} hover:bg-teal-700 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} transition-colors`}>
              Accept Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Market.displayName = 'Market';

export default Market;