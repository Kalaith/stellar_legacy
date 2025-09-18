import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import { UI_CONSTANTS } from '../../../constants/uiConstants';
import type { CrewMember } from '../../../types/game';
import type { CrewMemberId } from '../../../types/branded';

const Legacy: React.FC = () => {
  const { crew, legacy, selectHeir } = useGameStore();

  const captain = crew.find(c => c.role === 'Captain');
  const potentialHeirs = crew.filter(member => member.role !== 'Captain' && member.age < 50);

  const handleSelectHeir = (heirId: CrewMemberId) => {
    selectHeir(heirId);
  };

  const getTopSkills = (skills: CrewMember['skills']) => {
    return Object.entries(skills)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([skill]) => skill);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Family Tree */}
      <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
        <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{legacy.familyName} Family Legacy</h3>
        <div className="space-y-4">
          <div className={`p-4 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
            <h4 className={`font-medium mb-3 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Current Generation: {legacy.generation}</h4>
            {captain && (
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${UI_CONSTANTS.COLORS.BG_TERTIARY} rounded-full flex items-center justify-center text-2xl`}>
                  👩‍✈️
                </div>
                <div className="flex-1">
                  <h5 className={`font-medium text-lg ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{captain.name}</h5>
                  <p className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
                    Age: {captain.age} | {legacy.traits.join(', ')}
                  </p>
                  <div className="mt-2">
                    <div className={`text-xs ${UI_CONSTANTS.COLORS.TEXT_MUTED}`}>Best Skills:</div>
                    <div className="flex space-x-2 mt-1">
                      {getTopSkills(captain.skills).map((skill, index) => (
                        <span key={index} className={`px-2 py-1 ${UI_CONSTANTS.COLORS.BG_SUCCESS} text-xs rounded ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className={`font-medium mb-3 ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Potential Heirs</h4>
            <div className="space-y-2">
              {potentialHeirs.map((heir) => (
                <div key={heir.id} className={`p-3 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className={`font-medium ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{heir.name}</div>
                      <div className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>
                        Age: {heir.age} | {heir.role}
                      </div>
                      <div className={`text-xs ${UI_CONSTANTS.COLORS.TEXT_MUTED} mt-1`}>
                        Best Skills: {getTopSkills(heir.skills).join(', ')}
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium border ${UI_CONSTANTS.COLORS.BORDER_LIGHT} ${UI_CONSTANTS.COLORS.TEXT_SECONDARY} ${UI_CONSTANTS.COLORS.HOVER_BG_TERTIARY} transition-colors`}
                      onClick={() => handleSelectHeir(heir.id)}
                    >
                      Select Heir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Reputation */}
      <div className="space-y-4">
        <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
          <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Achievements</h3>
          <div className="space-y-2">
            {legacy.achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 ${UI_CONSTANTS.COLORS.BG_SECONDARY} rounded-lg`}>
                <span className="text-2xl">🏆</span>
                <span className={`font-medium ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.SPACING.CARD_PADDING} ${UI_CONSTANTS.CARDS.BORDER}`}>
          <h3 className={`text-lg font-semibold ${UI_CONSTANTS.SPACING.SECTION_MARGIN} ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>Reputation</h3>
          <div className="space-y-3">
            {Object.entries(legacy.reputation).map(([faction, reputation]) => (
              <div key={faction}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`capitalize font-medium ${UI_CONSTANTS.COLORS.TEXT_PRIMARY}`}>{faction}</span>
                  <span className={`text-sm ${UI_CONSTANTS.COLORS.TEXT_SECONDARY}`}>{reputation}</span>
                </div>
                <div className={`w-full ${UI_CONSTANTS.COLORS.BG_TERTIARY} rounded-full h-2`}>
                  <div
                    className={`${UI_CONSTANTS.COLORS.BG_SUCCESS} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(100, (reputation / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legacy;