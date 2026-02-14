import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '../useGameStore';

// Mock dependencies
vi.mock('../../utils/logger', () => ({
  default: {
    info: vi.fn(),
    resourceChange: vi.fn(),
    crewAction: vi.fn(),
    gameAction: vi.fn(),
    systemEvent: vi.fn(),
  },
}));

vi.mock('../../config/gameConfig', () => ({
  default: {
    intervals: {
      resourceGeneration: 1000,
      notificationTimeout: 5000,
    },
    limits: {
      maxCrewMembers: 10,
      maxStarSystems: 5,
      maxNotifications: 10,
    },
  },
}));

describe('useGameStore', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    // Reset store to initial state
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.initializeGame();
    });
  });

  afterEach(() => {
    // Cleanup intervals
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.cleanup();
    });
  });

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useGameStore());

      expect(result.current.resources.credits).toBeGreaterThanOrEqual(1000);
      expect(result.current.ship.name).toBe("Pioneer's Dream");
      expect(result.current.crew).toHaveLength(4);
      expect(result.current.currentTab).toBe('dashboard');
    });
  });

  describe('switchTab', () => {
    it('should switch to the specified tab', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.switchTab('galaxy-map');
      });

      expect(result.current.currentTab).toBe('galaxy-map');
    });
  });

  describe('generateResources', () => {
    it('should increase resources based on generation rate', () => {
      const { result } = renderHook(() => useGameStore());
      const initialCredits = result.current.resources.credits;

      act(() => {
        result.current.generateResources();
      });

      expect(result.current.resources.credits).toBeGreaterThan(initialCredits);
      expect(result.current.resources.energy).toBeGreaterThan(100);
    });
  });

  describe('selectSystem', () => {
    it('should select the specified system', () => {
      const { result } = renderHook(() => useGameStore());
      const system = result.current.starSystems[0];

      act(() => {
        result.current.selectSystem(system);
      });

      expect(result.current.selectedSystem).toEqual(system);
    });
  });

  describe('canAffordComponent', () => {
    it('should return true when resources are sufficient', () => {
      const { result } = renderHook(() => useGameStore());
      const cost = { credits: 500 };

      const canAfford = result.current.canAffordComponent(cost);
      expect(canAfford).toBe(true);
    });

    it('should return false when resources are insufficient', () => {
      const { result } = renderHook(() => useGameStore());
      const cost = { credits: 2000 };

      const canAfford = result.current.canAffordComponent(cost);
      expect(canAfford).toBe(false);
    });
  });

  describe('showNotification', () => {
    it('should add a notification to the list', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.showNotification('Test message', 'success');
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe('Test message');
      expect(result.current.notifications[0].type).toBe('success');
    });
  });

  describe('clearNotification', () => {
    it('should remove the specified notification', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.showNotification('Test message');
      });

      const notificationId = result.current.notifications[0].id;

      act(() => {
        result.current.clearNotification(notificationId);
      });

      expect(result.current.notifications.find(n => n.id === notificationId)).toBeUndefined();
    });
  });

  describe('generateRandomCrew', () => {
    it('should generate a crew member with valid properties', () => {
      const { result } = renderHook(() => useGameStore());

      const crewMember = result.current.generateRandomCrew();

      expect(crewMember).toHaveProperty('id');
      expect(crewMember).toHaveProperty('name');
      expect(crewMember).toHaveProperty('role');
      expect(crewMember).toHaveProperty('skills');
      expect(crewMember).toHaveProperty('morale');
      expect(crewMember).toHaveProperty('background');
      expect(crewMember).toHaveProperty('age');
      expect(crewMember.isHeir).toBe(false);

      // Validate skill ranges
      Object.values(crewMember.skills).forEach(skill => {
        expect(skill).toBeGreaterThanOrEqual(2);
        expect(skill).toBeLessThanOrEqual(10);
      });

      // Validate morale range
      expect(crewMember.morale).toBeGreaterThanOrEqual(60);
      expect(crewMember.morale).toBeLessThanOrEqual(90);

      // Validate age range
      expect(crewMember.age).toBeGreaterThanOrEqual(25);
      expect(crewMember.age).toBeLessThanOrEqual(45);
    });
  });

  describe('generatePlanets', () => {
    it('should generate planets with valid properties', () => {
      const { result } = renderHook(() => useGameStore());

      const planets = result.current.generatePlanets();

      expect(planets.length).toBeGreaterThanOrEqual(1);
      expect(planets.length).toBeLessThanOrEqual(3);

      planets.forEach(planet => {
        expect(planet).toHaveProperty('name');
        expect(planet).toHaveProperty('type');
        expect(planet).toHaveProperty('resources');
        expect(planet.developed).toBe(false);
        expect(planet.resources.length).toBeGreaterThanOrEqual(1);
        expect(planet.resources.length).toBeLessThanOrEqual(2);
      });
    });
  });
});
