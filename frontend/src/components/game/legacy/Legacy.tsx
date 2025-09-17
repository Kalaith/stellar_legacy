import React from 'react';
import { useGameStore } from '../../../stores/useGameStore';
import type { CrewMember } from '../../../types/game';

const Legacy: React.FC = () => {
  const { crew, legacy, selectHeir } = useGameStore();

  const captain = crew.find(c => c.role === 'Captain');
  const potentialHeirs = crew.filter(
    member => member.role !== 'Captain' && member.age < 50
  );

  const handleSelectHeir = (heirId: number) => {
    selectHeir(heirId);
  };

  const getTopSkills = (skills: CrewMember['skills']) => {
    return Object.entries(skills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([skill]) => skill);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Family Tree */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">
          {legacy.familyName} Family Legacy
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h4 className="font-medium mb-3 text-white">
              Current Generation: {legacy.generation}
            </h4>
            {captain && (
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-2xl">
                  👩‍✈️
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-lg text-white">
                    {captain.name}
                  </h5>
                  <p className="text-sm text-slate-300">
                    Age: {captain.age} | {legacy.traits.join(', ')}
                  </p>
                  <div className="mt-2">
                    <div className="text-xs text-slate-400">Best Skills:</div>
                    <div className="flex space-x-2 mt-1">
                      {getTopSkills(captain.skills).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-teal-600 text-xs rounded text-white"
                        >
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
            <h4 className="font-medium mb-3 text-white">Potential Heirs</h4>
            <div className="space-y-2">
              {potentialHeirs.map(heir => (
                <div key={heir.id} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-white">{heir.name}</div>
                      <div className="text-sm text-slate-300">
                        Age: {heir.age} | {heir.role}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Best Skills: {getTopSkills(heir.skills).join(', ')}
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 rounded text-sm font-medium border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors"
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
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Achievements
          </h3>
          <div className="space-y-2">
            {legacy.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg"
              >
                <span className="text-2xl">🏆</span>
                <span className="font-medium text-white">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Reputation</h3>
          <div className="space-y-3">
            {Object.entries(legacy.reputation).map(([faction, reputation]) => (
              <div key={faction}>
                <div className="flex justify-between items-center mb-1">
                  <span className="capitalize font-medium text-white">
                    {faction}
                  </span>
                  <span className="text-sm text-slate-300">{reputation}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (reputation / 100) * 100)}%`,
                    }}
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
