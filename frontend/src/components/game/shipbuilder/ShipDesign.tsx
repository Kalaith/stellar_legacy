// components/game/shipbuilder/ShipDesign.tsx
import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { uiConstants } from '../../../constants/uiConstants';

const ShipDesign: React.FC = React.memo(() => {
  const { ship } = useGameStore();

  return (
    <div
      className={`${uiConstants.CARDS.BACKGROUND} ${uiConstants.CARDS.BASE} ${uiConstants.SPACING.CARD_PADDING} ${uiConstants.CARDS.BORDER}`}
    >
      <h3
        className={`text-xl font-bold ${uiConstants.COLORS.TEXT_PRIMARY} ${uiConstants.SPACING.SECTION_MARGIN}`}
      >
        Ship Design
      </h3>

      <div className="space-y-4">
        <div className="text-center">
          <div
            className={`w-48 h-32 ${uiConstants.COLORS.BG_SECONDARY} rounded-lg flex items-center justify-center mx-auto mb-4`}
          >
            <div className="text-6xl">🚀</div>
          </div>
          <h4 className={`text-lg ${uiConstants.COLORS.TEXT_PRIMARY} font-semibold`}>
            {ship.name}
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Hull</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>{ship.hull}</div>
          </div>
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Engine</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
              {ship.components.engine}
            </div>
          </div>
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Cargo</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
              {ship.components.cargo}
            </div>
          </div>
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Weapons</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
              {ship.components.weapons}
            </div>
          </div>
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Research</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
              {ship.components.research}
            </div>
          </div>
          <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
            <div className={`text-sm ${uiConstants.COLORS.TEXT_MUTED}`}>Quarters</div>
            <div className={`${uiConstants.COLORS.TEXT_PRIMARY} font-medium`}>
              {ship.components.quarters}
            </div>
          </div>
        </div>

        <div className={`${uiConstants.COLORS.BG_SECONDARY} rounded p-4`}>
          <h4 className={`${uiConstants.COLORS.TEXT_PRIMARY} font-semibold mb-2`}>
            Ship Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Speed: <span className={uiConstants.COLORS.TEXT_SUCCESS}>{ship.stats.speed}</span>
            </div>
            <div>
              Cargo: <span className={uiConstants.COLORS.TEXT_SUCCESS}>{ship.stats.cargo}</span>
            </div>
            <div>
              Combat: <span className={uiConstants.COLORS.TEXT_SUCCESS}>{ship.stats.combat}</span>
            </div>
            <div>
              Research:{' '}
              <span className={uiConstants.COLORS.TEXT_SUCCESS}>{ship.stats.research}</span>
            </div>
            <div>
              Crew Capacity:{' '}
              <span className={uiConstants.COLORS.TEXT_SUCCESS}>{ship.stats.crewCapacity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ShipDesign.displayName = 'ShipDesign';

export default ShipDesign;
