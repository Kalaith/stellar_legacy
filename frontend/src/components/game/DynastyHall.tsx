import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dynasty } from '../../types/generationalMissions';
import {
  TerminalWindow,
  TerminalText,
  TerminalButton,
  TerminalProgress,
} from '../ui/TerminalWindow';

interface DynastyHallProps {
  dynasties: Dynasty[];
  onDynastyAction?: (dynastyId: string, action: string) => void;
}

export const DynastyHall: React.FC<DynastyHallProps> = ({ dynasties, onDynastyAction }) => {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'stories' | 'influence'>(
    'overview'
  );

  const handleDynastySelect = (dynasty: Dynasty) => {
    setSelectedDynasty(dynasty);
    setActiveTab('overview');
  };

  const renderDynastyList = () => (
    <TerminalWindow title="DYNASTY REGISTRY" statusLine="OPERATIONAL">
      <div className="terminal-grid cols-3">
        {dynasties.map(dynasty => (
          <div
            key={dynasty.id}
            className="cursor-pointer"
            onClick={() => handleDynastySelect(dynasty)}
          >
            <TerminalWindow
              title={dynasty.name.toUpperCase()}
              className="hover:border-terminal-primary transition-colors"
              isActive={false}
            >
              <div className="terminal-space-y-sm">
                <div className="terminal-flex between">
                  <TerminalText variant="dim">GENERATION:</TerminalText>
                  <TerminalText variant="primary">{dynasty.generationsActive}</TerminalText>
                </div>

                <div className="terminal-flex between">
                  <TerminalText variant="dim">LEADER:</TerminalText>
                  <TerminalText variant="success">{dynasty.currentLeader.name}</TerminalText>
                </div>

                <div className="terminal-flex between">
                  <TerminalText variant="dim">SPEC:</TerminalText>
                  <TerminalText variant="warning">{dynasty.specialization}</TerminalText>
                </div>

                <TerminalProgress
                  value={dynasty.influence}
                  label="INFLUENCE"
                  variant={
                    dynasty.influence > 70
                      ? 'success'
                      : dynasty.influence > 40
                        ? 'warning'
                        : 'error'
                  }
                  ascii={true}
                />

                <div className="terminal-flex between">
                  <TerminalText variant="dim">MEMBERS:</TerminalText>
                  <TerminalText variant="primary">{dynasty.members.length}</TerminalText>
                </div>

                {dynasty.legacyTraits.length > 0 && (
                  <div className="border-t border-terminal-border pt-2 mt-2">
                    <TerminalText variant="bright" className="text-xs">
                      {dynasty.legacyTraits[0]}
                    </TerminalText>
                  </div>
                )}
              </div>
            </TerminalWindow>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );

  const renderDynastyDetail = () => {
    if (!selectedDynasty) return null;

    return (
      <TerminalWindow
        title={`DYNASTY PROFILE: ${selectedDynasty.name.toUpperCase()}`}
        statusLine={`Generation ${selectedDynasty.generationsActive} • Family Line: ${selectedDynasty.familyLine}`}
        onClose={() => setSelectedDynasty(null)}
        isActive={true}
      >
        <div className="terminal-space-y">
          {/* Terminal Tab Navigation */}
          <div className="terminal-flex">
            {(['overview', 'members', 'stories', 'influence'] as const).map(tab => (
              <TerminalButton
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'primary' : undefined}
                className={activeTab === tab ? 'terminal-glow-pulse' : ''}
              >
                {tab.toUpperCase()}
              </TerminalButton>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </TerminalWindow>
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
    <div className="terminal-grid cols-2">
      <TerminalWindow title="CURRENT LEADER" statusLine="ACTIVE">
        <div className="terminal-space-y-sm">
          <TerminalText variant="bright" className="terminal-h3">
            {selectedDynasty!.currentLeader.name}
          </TerminalText>

          <div className="terminal-flex between">
            <TerminalText variant="dim">AGE:</TerminalText>
            <TerminalText variant="primary">{selectedDynasty!.currentLeader.age}</TerminalText>
          </div>

          <div className="terminal-flex between">
            <TerminalText variant="dim">ROLE:</TerminalText>
            <TerminalText variant="primary">{selectedDynasty!.currentLeader.role}</TerminalText>
          </div>

          <div className="border-t border-terminal-border pt-2 mt-2">
            <TerminalText variant="dim" className="terminal-h3">
              SKILLS:
            </TerminalText>
            {Object.entries(selectedDynasty!.currentLeader.skills).map(([skill, value]) => (
              <div key={skill} className="terminal-flex between">
                <TerminalText variant="secondary">{skill.toUpperCase()}:</TerminalText>
                <TerminalText variant={value >= 8 ? 'success' : value >= 6 ? 'warning' : 'dim'}>
                  {value}
                </TerminalText>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      <TerminalWindow title="DYNASTY STATUS" statusLine="TRACKING">
        <div className="terminal-space-y-sm">
          <TerminalProgress
            value={selectedDynasty!.influence}
            label="INFLUENCE"
            variant={
              selectedDynasty!.influence > 70
                ? 'success'
                : selectedDynasty!.influence > 40
                  ? 'warning'
                  : 'error'
            }
            ascii={true}
          />

          <div className="terminal-flex between">
            <TerminalText variant="dim">MEMBERS:</TerminalText>
            <TerminalText variant="primary">{selectedDynasty!.members.length}</TerminalText>
          </div>

          <div className="terminal-flex between">
            <TerminalText variant="dim">GENERATIONS:</TerminalText>
            <TerminalText variant="primary">{selectedDynasty!.generationsActive}</TerminalText>
          </div>

          <div className="terminal-flex between">
            <TerminalText variant="dim">SPECIALIZATION:</TerminalText>
            <TerminalText variant="warning">{selectedDynasty!.specialization}</TerminalText>
          </div>
        </div>
      </TerminalWindow>

      <div className="col-span-2">
        <TerminalWindow title="LEGACY TRAITS" statusLine="INHERITED">
          <div className="terminal-flex wrap">
            {selectedDynasty!.legacyTraits.map((trait, index) => (
              <TerminalText
                key={index}
                variant="bright"
                className="border border-terminal-border px-2 py-1 mr-2 mb-2"
              >
                {trait}
              </TerminalText>
            ))}
          </div>
        </TerminalWindow>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <TerminalWindow
      title="DYNASTY MEMBERS"
      statusLine={`${selectedDynasty!.members.length} TOTAL MEMBERS`}
    >
      <div className="terminal-grid cols-2">
        {selectedDynasty!.members.map(member => (
          <TerminalWindow
            key={member.id}
            title={member.name.toUpperCase()}
            statusLine={member.isLeader ? 'LEADER' : member.role.toUpperCase()}
            className={member.isLeader ? 'border-terminal-warning' : undefined}
          >
            <div className="terminal-space-y-sm">
              <div className="terminal-flex between">
                <TerminalText variant="dim">AGE:</TerminalText>
                <TerminalText variant="primary">{member.age}</TerminalText>
              </div>

              <div className="border-t border-terminal-border pt-2">
                <TerminalText variant="dim" className="terminal-h3">
                  SKILLS:
                </TerminalText>
                <div className="terminal-grid cols-3">
                  {Object.entries(member.skills)
                    .slice(0, 3)
                    .map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <TerminalText variant="secondary" className="text-xs">
                          {skill.substring(0, 3).toUpperCase()}
                        </TerminalText>
                        <TerminalText
                          variant={value >= 8 ? 'success' : value >= 6 ? 'warning' : 'dim'}
                          className="block font-bold"
                        >
                          {value}
                        </TerminalText>
                      </div>
                    ))}
                </div>
              </div>

              {member.traits.length > 0 && (
                <div className="border-t border-terminal-border pt-2">
                  <TerminalText variant="bright" className="text-xs">
                    {member.traits[0]}
                  </TerminalText>
                </div>
              )}
            </div>
          </TerminalWindow>
        ))}
      </div>
    </TerminalWindow>
  );

  const renderStoriesTab = () => (
    <TerminalWindow title="DYNASTY STORIES" statusLine="ARCHIVED">
      {selectedDynasty!.storyThreads.length > 0 ? (
        <div className="terminal-space-y">
          {selectedDynasty!.storyThreads.map(story => (
            <TerminalWindow
              key={story.id}
              title={story.title.toUpperCase()}
              statusLine={story.isActive ? 'ACTIVE' : 'ARCHIVED'}
              className={story.isActive ? 'border-terminal-success' : 'border-terminal-dim'}
            >
              <div className="terminal-space-y-sm">
                <div className="terminal-flex between">
                  <TerminalText variant="dim">DURATION:</TerminalText>
                  <TerminalText variant="primary">
                    {story.generationsActive} GEN
                    {story.generationsActive > 1 ? 'S' : ''}
                  </TerminalText>
                </div>

                <div className="border-t border-terminal-border pt-2">
                  <TerminalText variant="secondary">{story.description}</TerminalText>
                </div>
              </div>
            </TerminalWindow>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <TerminalText variant="dim">NO STORY THREADS RECORDED FOR THIS DYNASTY YET.</TerminalText>
        </div>
      )}
    </TerminalWindow>
  );

  const renderInfluenceTab = () => {
    const influenceLevel = selectedDynasty!.influence;
    const getInfluenceDescription = (level: number) => {
      if (level > 80) return 'DOMINANT - THIS DYNASTY LEADS IN ALL MAJOR DECISIONS';
      if (level > 60) return 'INFLUENTIAL - SIGNIFICANT VOICE IN COLONY MATTERS';
      if (level > 40) return 'RESPECTED - MODERATE INFLUENCE ON DECISIONS';
      if (level > 20) return 'LIMITED - MINOR VOICE IN GOVERNANCE';
      return 'MARGINAL - LITTLE POLITICAL INFLUENCE';
    };

    return (
      <div className="terminal-grid cols-1">
        <TerminalWindow title="POLITICAL INFLUENCE" statusLine="ANALYZING">
          <div className="terminal-space-y">
            <TerminalProgress
              value={influenceLevel}
              label="CURRENT INFLUENCE"
              variant={influenceLevel > 70 ? 'success' : influenceLevel > 40 ? 'warning' : 'error'}
              ascii={true}
            />

            <TerminalText variant="secondary" className="text-sm">
              {getInfluenceDescription(influenceLevel)}
            </TerminalText>
          </div>
        </TerminalWindow>

        <TerminalWindow title="INFLUENCE SOURCES" statusLine="BREAKDOWN">
          <div className="terminal-space-y-sm">
            <div className="terminal-flex between">
              <TerminalText variant="dim">SPECIALIZATION AUTHORITY:</TerminalText>
              <TerminalText variant="warning">+{Math.floor(influenceLevel * 0.3)}%</TerminalText>
            </div>
            <div className="terminal-flex between">
              <TerminalText variant="dim">LEADER SKILLS:</TerminalText>
              <TerminalText variant="warning">+{Math.floor(influenceLevel * 0.25)}%</TerminalText>
            </div>
            <div className="terminal-flex between">
              <TerminalText variant="dim">HISTORICAL LEGACY:</TerminalText>
              <TerminalText variant="warning">+{Math.floor(influenceLevel * 0.2)}%</TerminalText>
            </div>
            <div className="terminal-flex between">
              <TerminalText variant="dim">DYNASTY SIZE:</TerminalText>
              <TerminalText variant="warning">+{Math.floor(influenceLevel * 0.15)}%</TerminalText>
            </div>
            <div className="terminal-flex between">
              <TerminalText variant="dim">RECENT ACTIONS:</TerminalText>
              <TerminalText variant={influenceLevel > 50 ? 'success' : 'error'}>
                {influenceLevel > 50 ? '+' : ''}
                {Math.floor((influenceLevel - 50) * 0.1)}%
              </TerminalText>
            </div>
          </div>
        </TerminalWindow>

        {onDynastyAction && (
          <TerminalWindow title="DYNASTY ACTIONS" statusLine="AVAILABLE">
            <div className="terminal-grid cols-2">
              <TerminalButton
                onClick={() => onDynastyAction(selectedDynasty!.id, 'grant_autonomy')}
                variant="primary"
              >
                GRANT AUTONOMY
              </TerminalButton>
              <TerminalButton
                onClick={() => onDynastyAction(selectedDynasty!.id, 'assign_mission')}
                variant="success"
              >
                ASSIGN MISSION
              </TerminalButton>
              <TerminalButton
                onClick={() => onDynastyAction(selectedDynasty!.id, 'promote_member')}
                variant="warning"
              >
                PROMOTE MEMBER
              </TerminalButton>
              <TerminalButton
                onClick={() => onDynastyAction(selectedDynasty!.id, 'expand_influence')}
                variant="primary"
              >
                EXPAND INFLUENCE
              </TerminalButton>
            </div>
          </TerminalWindow>
        )}
      </div>
    );
  };

  return (
    <div className="terminal-window active fullscreen">
      <div className="terminal-header">
        <div className="terminal-title-bar">
          ┌─[◎ DYNASTY HALL - COMMAND INTERFACE]─────────────────────┐
        </div>
        <div className="terminal-status">
          │ STATUS: MANAGING GREAT FAMILIES ACROSS GENERATIONS │
        </div>
        <div className="terminal-separator">
          ├──────────────────────────────────────────────────────────┤
        </div>
      </div>

      <div className="terminal-content">
        {selectedDynasty ? renderDynastyDetail() : renderDynastyList()}
      </div>

      <div className="terminal-footer">
        └──────────────────────────────────────────────────────────┘
      </div>
    </div>
  );
};

export default DynastyHall;
