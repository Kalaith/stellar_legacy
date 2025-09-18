import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dynasty } from '../../types/generationalMissions';

interface DynastyHallProps {
  dynasties: Dynasty[];
  onDynastyAction?: (dynastyId: string, action: string) => void;
}

export const DynastyHall: React.FC<DynastyHallProps> = ({
  dynasties,
  onDynastyAction
}) => {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'stories' | 'influence'>('overview');

  const handleDynastySelect = (dynasty: Dynasty) => {
    setSelectedDynasty(dynasty);
    setActiveTab('overview');
  };

  const renderDynastyList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dynasties.map((dynasty) => (
        <motion.div
          key={dynasty.id}
          className="bg-gray-800 rounded-lg p-4 cursor-pointer border border-gray-700 hover:border-blue-500 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDynastySelect(dynasty)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-blue-400">{dynasty.name}</h3>
            <div className="text-sm text-gray-400">Gen {dynasty.generationsActive}</div>
          </div>

          <div className="mb-3">
            <div className="text-sm text-gray-300 mb-1">
              Leader: <span className="text-green-400">{dynasty.currentLeader.name}</span>
            </div>
            <div className="text-sm text-gray-300">
              Specialization: <span className="text-yellow-400">{dynasty.specialization}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-400">Influence: </span>
              <span className={`font-semibold ${
                dynasty.influence > 70 ? 'text-green-400' :
                dynasty.influence > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {dynasty.influence}%
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {dynasty.members.length} members
            </div>
          </div>

          {dynasty.legacyTraits.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-blue-300">
                {dynasty.legacyTraits[0]}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderDynastyDetail = () => {
    if (!selectedDynasty) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-2">{selectedDynasty.name}</h2>
            <div className="text-sm text-gray-300">
              Family Line: {selectedDynasty.familyLine} • Generation {selectedDynasty.generationsActive}
            </div>
          </div>
          <button
            onClick={() => setSelectedDynasty(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {(['overview', 'members', 'stories', 'influence'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!selectedDynasty) return null;

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'members':
        return renderMembersTab();
      case 'stories':
        return renderStoriesTab();
      case 'influence':
        return renderInfluenceTab();
      default:
        return null;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-400 mb-3">Current Leader</h4>
          <div className="space-y-2">
            <div className="text-white font-medium">{selectedDynasty!.currentLeader.name}</div>
            <div className="text-gray-300">Age: {selectedDynasty!.currentLeader.age}</div>
            <div className="text-gray-300">Role: {selectedDynasty!.currentLeader.role}</div>
            <div className="mt-3">
              <div className="text-sm text-gray-400 mb-2">Skills:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedDynasty!.currentLeader.skills).map(([skill, value]) => (
                  <div key={skill} className="flex justify-between">
                    <span className="capitalize text-gray-300">{skill}:</span>
                    <span className={`font-semibold ${
                      value >= 8 ? 'text-green-400' :
                      value >= 6 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Dynasty Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Influence:</span>
              <span className={`font-semibold ${
                selectedDynasty!.influence > 70 ? 'text-green-400' :
                selectedDynasty!.influence > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {selectedDynasty!.influence}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Members:</span>
              <span className="text-white">{selectedDynasty!.members.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Generations:</span>
              <span className="text-white">{selectedDynasty!.generationsActive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Specialization:</span>
              <span className="text-blue-400">{selectedDynasty!.specialization}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-purple-400 mb-3">Legacy Traits</h4>
        <div className="flex flex-wrap gap-2">
          {selectedDynasty!.legacyTraits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-green-400">Dynasty Members</h4>
        <div className="text-sm text-gray-400">
          {selectedDynasty!.members.length} total members
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedDynasty!.members.map((member) => (
          <div
            key={member.id}
            className={`bg-gray-700 rounded-lg p-4 border ${
              member.isLeader ? 'border-yellow-500' : 'border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-white">{member.name}</div>
                <div className="text-sm text-gray-300">{member.role}</div>
              </div>
              {member.isLeader && (
                <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">
                  Leader
                </span>
              )}
            </div>

            <div className="text-sm text-gray-300 mb-2">Age: {member.age}</div>

            <div className="mb-2">
              <div className="text-xs text-gray-400 mb-1">Skills:</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {Object.entries(member.skills).slice(0, 3).map(([skill, value]) => (
                  <div key={skill} className="text-center">
                    <div className="text-gray-400 capitalize">{skill.substring(0, 3)}</div>
                    <div className={`font-semibold ${
                      value >= 8 ? 'text-green-400' :
                      value >= 6 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {member.traits.length > 0 && (
              <div className="text-xs text-blue-300">
                {member.traits[0]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStoriesTab = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-blue-400">Dynasty Stories</h4>

      {selectedDynasty!.storyThreads.map((story) => (
        <div
          key={story.id}
          className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
            story.isActive ? 'border-blue-500' : 'border-gray-500'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-medium text-white">{story.title}</h5>
            <div className="flex items-center space-x-2">
              {story.isActive && (
                <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs">
                  Active
                </span>
              )}
              <span className="text-xs text-gray-400">
                {story.generationsActive} gen{story.generationsActive > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm">{story.description}</p>
        </div>
      ))}

      {selectedDynasty!.storyThreads.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No story threads recorded for this dynasty yet.
        </div>
      )}
    </div>
  );

  const renderInfluenceTab = () => {
    const influenceLevel = selectedDynasty!.influence;
    const getInfluenceColor = (level: number) => {
      if (level > 70) return 'text-green-400';
      if (level > 40) return 'text-yellow-400';
      return 'text-red-400';
    };

    const getInfluenceDescription = (level: number) => {
      if (level > 80) return 'Dominant - This dynasty leads in all major decisions';
      if (level > 60) return 'Influential - Significant voice in colony matters';
      if (level > 40) return 'Respected - Moderate influence on decisions';
      if (level > 20) return 'Limited - Minor voice in governance';
      return 'Marginal - Little political influence';
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-400 mb-4">Political Influence</h4>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Current Influence</span>
              <span className={`font-bold ${getInfluenceColor(influenceLevel)}`}>
                {influenceLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  influenceLevel > 70 ? 'bg-green-500' :
                  influenceLevel > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${influenceLevel}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-300">{getInfluenceDescription(influenceLevel)}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Influence Sources</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Specialization Authority</span>
              <span className="text-blue-400">+{Math.floor(influenceLevel * 0.3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Leader Skills</span>
              <span className="text-blue-400">+{Math.floor(influenceLevel * 0.25)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Historical Legacy</span>
              <span className="text-blue-400">+{Math.floor(influenceLevel * 0.2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Dynasty Size</span>
              <span className="text-blue-400">+{Math.floor(influenceLevel * 0.15)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Recent Actions</span>
              <span className={influenceLevel > 50 ? 'text-green-400' : 'text-red-400'}>
                {influenceLevel > 50 ? '+' : ''}{Math.floor((influenceLevel - 50) * 0.1)}%
              </span>
            </div>
          </div>
        </div>

        {onDynastyAction && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Dynasty Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDynastyAction(selectedDynasty!.id, 'grant_autonomy')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              >
                Grant Autonomy
              </button>
              <button
                onClick={() => onDynastyAction(selectedDynasty!.id, 'assign_mission')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
              >
                Assign Mission
              </button>
              <button
                onClick={() => onDynastyAction(selectedDynasty!.id, 'promote_member')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
              >
                Promote Member
              </button>
              <button
                onClick={() => onDynastyAction(selectedDynasty!.id, 'expand_influence')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
              >
                Expand Influence
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">⬢ Dynasty Hall</h1>
        <p className="text-gray-300">
          Manage the great families that shape your civilization's destiny across generations.
        </p>
      </div>

      {selectedDynasty ? renderDynastyDetail() : renderDynastyList()}
    </div>
  );
};

export default DynastyHall;