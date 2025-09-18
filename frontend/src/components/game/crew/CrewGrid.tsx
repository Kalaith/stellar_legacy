// components/game/crew/CrewGrid.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { UI_CONSTANTS } from '../../../constants/uiConstants';
import type { CrewMemberId } from '../../../types/branded';

const CrewGrid: React.FC = () => {
  const { crew } = useGameStore();

  return (
    <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
      <h3 className={`text-xl font-bold ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} ${UI_CONSTANTS.SPACING.SECTION_MARGIN}`}>Current Crew</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crew.map(member => (
          <CrewCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

interface CrewCardProps {
  member: {
    id: CrewMemberId;
    name: string;
    role: string;
    skills: {
      engineering: number;
      navigation: number;
      combat: number;
      diplomacy: number;
      trade: number;
    };
    morale: number;
    background: string;
    age: number;
    isHeir: boolean;
  };
}

const CrewCard: React.FC<CrewCardProps> = React.memo(({ member }) => {
  const getMoraleColor = useMemo(() => (morale: number) => {
    if (morale > 70) return 'bg-green-400';  // Keep green for morale visual - semantic use
    if (morale > 50) return 'bg-yellow-600'; // Yellow for warning state
    return 'bg-red-500';                     // Red for low morale
  }, []);

  const getSkillBarWidth = useMemo(() => (level: number) => `${(level / 10) * 100}%`, []);

  const skillEntries = useMemo(() =>
    Object.entries(member.skills),
    [member.skills]
  );

  return (
    <div className={`${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg p-4 border ${UI_CONSTANTS.COLORS.BORDER}`}>
      <div className={`flex items-center justify-between ${UI_CONSTANTS.SPACING.SECTION_MARGIN_SM}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${UI_CONSTANTS.COLORS.BG_TERTIARY} rounded-full flex items-center justify-center`}>
            <span className="text-lg">👤</span>
          </div>
          <div>
            <h4 className={`${UI_CONSTANTS.COLORS.TEXT_PRIMARY} font-semibold`}>{member.name}</h4>
            <p className={`${UI_CONSTANTS.COLORS.TEXT_MUTED} text-sm`}>{member.role} • Age {member.age}</p>
          </div>
        </div>
        {member.isHeir && (
          <span className={`${UI_CONSTANTS.COLORS.BG_WARNING} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY} text-xs px-2 py-1 rounded`}>
            Heir
          </span>
        )}
      </div>

      <div className={`space-y-2 ${UI_CONSTANTS.SPACING.SECTION_MARGIN_SM}`}>
        {skillEntries.map(([skill, level]) => (
          <div key={skill} className="flex items-center justify-between">
            <span className={`${UI_CONSTANTS.COLORS.TEXT_SECONDARY} text-sm capitalize w-20`}>{skill}</span>
            <div className="flex-1 mx-2">
              <div className={`w-full ${UI_CONSTANTS.COLORS.BG_TERTIARY} rounded-full h-2`}>
                <div
                  className={`${UI_CONSTANTS.COLORS.BG_SUCCESS} h-2 rounded-full transition-all duration-300`}
                  style={{ width: getSkillBarWidth(level) }}
                />
              </div>
            </div>
            <span className={`${UI_CONSTANTS.COLORS.TEXT_PRIMARY} text-sm w-6 text-right`}>{level}</span>
          </div>
        ))}
      </div>

      <div className={`flex items-center justify-between ${UI_CONSTANTS.SPACING.SECTION_MARGIN_SM}`}>
        <span className={`${UI_CONSTANTS.COLORS.TEXT_SECONDARY} text-sm`}>Morale</span>
        <div className="flex items-center space-x-2">
          <div className={`w-20 ${UI_CONSTANTS.COLORS.BG_TERTIARY} rounded-full h-2`}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getMoraleColor(member.morale)}`}
              style={{ width: `${member.morale}%` }}
            />
          </div>
          <span className={`${UI_CONSTANTS.COLORS.TEXT_PRIMARY} text-sm w-8 text-right`}>{member.morale}</span>
        </div>
      </div>

      <p className={`${UI_CONSTANTS.COLORS.TEXT_MUTED} text-xs leading-relaxed`}>{member.background}</p>
    </div>
  );
});

CrewCard.displayName = 'CrewCard';

export default CrewGrid;