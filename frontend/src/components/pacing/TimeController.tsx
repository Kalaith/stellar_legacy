// components/pacing/TimeController.tsx
import React, { useState } from 'react';
import { TerminalWindow } from '../ui/TerminalWindow';
import { TerminalText } from '../ui/TerminalWindow';
import type {
  PacingState,
  GamePhase,
  PacingPreferences,
  EngagementLevel,
} from '../../types/pacing';

interface TimeControllerProps {
  pacingState: PacingState;
  onPacingChange: (newState: Partial<PacingState>) => void;
  onPreferencesChange: (preferences: PacingPreferences) => void;
  onEmergencyPause: () => void;
  onForceResume: () => void;
  isPaused?: boolean;
}

export const TimeController: React.FC<TimeControllerProps> = ({
  pacingState,
  onPacingChange,
  onPreferencesChange,
  onEmergencyPause,
  onForceResume,
  isPaused = false
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<PacingPreferences>(pacingState.playerPreferences);

  const getPhaseColor = (phase: GamePhase): string => {
    switch (phase) {
      case 'early': return 'text-green-400';
      case 'mid': return 'text-yellow-400';
      case 'late': return 'text-orange-400';
      case 'arrival': return 'text-red-400';
      case 'post-mission': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getEngagementColor = (level: EngagementLevel): string => {
    switch (level) {
      case 'very_high': return 'text-green-400';
      case 'high': return 'text-green-300';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      case 'very_low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleAccelerationChange = (newAcceleration: number) => {
    onPacingChange({ timeAcceleration: newAcceleration });
  };

  const handleAutomationChange = (newLevel: number) => {
    onPacingChange({ automationLevel: newLevel });
  };

  const handlePreferencesSave = () => {
    onPreferencesChange(localPreferences);
    setShowPreferences(false);
  };

  const formatAcceleration = (acceleration: number): string => {
    if (acceleration === 1) return '1x (Normal)';
    if (acceleration < 1) return `${acceleration.toFixed(1)}x (Slower)`;
    return `${acceleration.toFixed(1)}x (Faster)`;
  };

  const formatEngagement = (score: number): EngagementLevel => {
    if (score >= 0.8) return 'very_high';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'moderate';
    if (score >= 0.2) return 'low';
    return 'very_low';
  };

  return (
    <div className="space-y-6">
      {/* Main Time Control */}
      <TerminalWindow title="Mission Pacing Control" className="h-auto">
        <div className="space-y-4">
          {/* Status Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <TerminalText className="text-gray-400 text-sm">Current Phase</TerminalText>
              <TerminalText className={`font-bold ${getPhaseColor(pacingState.currentPhase)}`}>
                {pacingState.currentPhase}
              </TerminalText>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${getPhaseColor(pacingState.currentPhase).replace('text', 'bg')}`}
                  style={{ width: `${pacingState.phaseProgress * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <TerminalText className="text-gray-400 text-sm">Time Speed</TerminalText>
              <TerminalText className="font-bold text-cyan-400">
                {formatAcceleration(pacingState.timeAcceleration)}
              </TerminalText>
              <TerminalText className={`text-sm ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
                {isPaused ? 'PAUSED' : 'RUNNING'}
              </TerminalText>
            </div>

            <div className="text-center">
              <TerminalText className="text-gray-400 text-sm">Player Engagement</TerminalText>
              <TerminalText className={`font-bold ${getEngagementColor(formatEngagement(pacingState.engagementScore))}`}>
                {formatEngagement(pacingState.engagementScore).replace('_', ' ')}
              </TerminalText>
              <TerminalText className="text-sm text-gray-400">
                {(pacingState.engagementScore * 100).toFixed(0)}%
              </TerminalText>
            </div>

            <div className="text-center">
              <TerminalText className="text-gray-400 text-sm">Automation</TerminalText>
              <TerminalText className="font-bold text-purple-400">
                {(pacingState.automationLevel * 100).toFixed(0)}%
              </TerminalText>
              <TerminalText className="text-sm text-gray-400">
                Active
              </TerminalText>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-gray-600 pt-4 space-y-4">
            {/* Time Acceleration Control */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Time Acceleration: {formatAcceleration(pacingState.timeAcceleration)}
              </label>
              <div className="flex items-center space-x-4">
                <TerminalText className="text-sm text-gray-400">0.1x</TerminalText>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={pacingState.timeAcceleration}
                  onChange={(e) => handleAccelerationChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <TerminalText className="text-sm text-gray-400">10x</TerminalText>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleAccelerationChange(0.5)}
                  className="px-3 py-1 bg-blue-900/30 border border-blue-400 text-blue-400
                           rounded text-sm hover:bg-blue-800/30 transition-colors"
                >
                  Slow
                </button>
                <button
                  onClick={() => handleAccelerationChange(1.0)}
                  className="px-3 py-1 bg-green-900/30 border border-green-400 text-green-400
                           rounded text-sm hover:bg-green-800/30 transition-colors"
                >
                  Normal
                </button>
                <button
                  onClick={() => handleAccelerationChange(3.0)}
                  className="px-3 py-1 bg-yellow-900/30 border border-yellow-400 text-yellow-400
                           rounded text-sm hover:bg-yellow-800/30 transition-colors"
                >
                  Fast
                </button>
              </div>
            </div>

            {/* Automation Control */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Automation Level: {(pacingState.automationLevel * 100).toFixed(0)}%
              </label>
              <div className="flex items-center space-x-4">
                <TerminalText className="text-sm text-gray-400">Manual</TerminalText>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={pacingState.automationLevel}
                  onChange={(e) => handleAutomationChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <TerminalText className="text-sm text-gray-400">Auto</TerminalText>
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="flex space-x-4">
              {isPaused ? (
                <button
                  onClick={onForceResume}
                  className="flex-1 px-4 py-2 bg-green-900/30 border border-green-400
                           text-green-400 rounded hover:bg-green-800/30 transition-colors"
                >
                  Force Resume
                </button>
              ) : (
                <button
                  onClick={onEmergencyPause}
                  className="flex-1 px-4 py-2 bg-red-900/30 border border-red-400
                           text-red-400 rounded hover:bg-red-800/30 transition-colors"
                >
                  Emergency Pause
                </button>
              )}

              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex-1 px-4 py-2 bg-purple-900/30 border border-purple-400
                         text-purple-400 rounded hover:bg-purple-800/30 transition-colors"
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* Next Milestone */}
      {pacingState.nextMilestone && (
        <TerminalWindow title="Upcoming Milestone" className="h-auto">
          <div className="space-y-2">
            <TerminalText className="text-cyan-400 font-bold">
              {pacingState.nextMilestone.title}
            </TerminalText>
            <TerminalText className="text-gray-300">
              {pacingState.nextMilestone.description}
            </TerminalText>
            <div className="flex justify-between items-center text-sm">
              <TerminalText className="text-yellow-400">
                Scheduled: Year {pacingState.nextMilestone.scheduledYear}
              </TerminalText>
              <TerminalText className="text-blue-400">
                Priority: {pacingState.nextMilestone.priority.toFixed(1)}
              </TerminalText>
            </div>
          </div>
        </TerminalWindow>
      )}

      {/* Preferences Panel */}
      {showPreferences && (
        <TerminalWindow title="Pacing Preferences" className="h-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Preferred Speed</label>
                <select
                  value={localPreferences.preferredSpeed}
                  onChange={(e) => setLocalPreferences({
                    ...localPreferences,
                    preferredSpeed: e.target.value as PacingPreferences['preferredSpeed']
                  })}
                  className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
                >
                  <option value="slow">Slow & Deliberate</option>
                  <option value="medium">Medium Pace</option>
                  <option value="fast">Fast Action</option>
                  <option value="adaptive">Adaptive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Crisis Handling</label>
                <select
                  value={localPreferences.crisisHandling}
                  onChange={(e) => setLocalPreferences({
                    ...localPreferences,
                    crisisHandling: e.target.value as PacingPreferences['crisisHandling']
                  })}
                  className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
                >
                  <option value="immediate">Always Interrupt</option>
                  <option value="guided">Guided Resolution</option>
                  <option value="automated">Automated When Possible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Milestone Frequency</label>
                <select
                  value={localPreferences.milestoneFrequency}
                  onChange={(e) => setLocalPreferences({
                    ...localPreferences,
                    milestoneFrequency: e.target.value as PacingPreferences['milestoneFrequency']
                  })}
                  className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
                >
                  <option value="sparse">Rare but Meaningful</option>
                  <option value="moderate">Balanced</option>
                  <option value="frequent">Rich Story Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Narrative Style</label>
                <select
                  value={localPreferences.narrativeStyle}
                  onChange={(e) => setLocalPreferences({
                    ...localPreferences,
                    narrativeStyle: e.target.value as PacingPreferences['narrativeStyle']
                  })}
                  className="w-full bg-gray-800 border border-gray-600 text-green-400 p-2 rounded"
                >
                  <option value="minimal">Key Points Only</option>
                  <option value="concise">Concise Descriptions</option>
                  <option value="detailed">Rich Narrative</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Automation Threshold: {(localPreferences.automationThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localPreferences.automationThreshold}
                onChange={(e) => setLocalPreferences({
                  ...localPreferences,
                  automationThreshold: parseFloat(e.target.value)
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <TerminalText className="text-xs text-gray-500 mt-1">
                How quickly the game should automate decisions when you're not actively playing
              </TerminalText>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handlePreferencesSave}
                className="flex-1 px-4 py-2 bg-green-900/30 border border-green-400
                         text-green-400 rounded hover:bg-green-800/30 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 px-4 py-2 bg-gray-900/30 border border-gray-400
                         text-gray-400 rounded hover:bg-gray-800/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </TerminalWindow>
      )}
    </div>
  );
};
