import { describe, expect, it } from 'vitest';
import { Phase1SimulationService } from '../Phase1SimulationService';

describe('Phase1SimulationService', () => {
  it('creates deterministic initial state and progresses one month', () => {
    const state = Phase1SimulationService.createInitialState(2201);
    const next = Phase1SimulationService.tickMonth(state, 2201);

    expect(next.time.tick).toBe(1);
    expect(next.time.month).toBe(2);
    expect(next.time.year).toBe(2200);
    expect(next.contract.outcome).toBeNull();
  });

  it('records handover when passing leadership end year', () => {
    const base = Phase1SimulationService.createInitialState(2201);
    const state = {
      ...base,
      time: { ...base.time, year: 2219, month: 12, tick: 200 },
      contract: { ...base.contract, dueYear: 2300 },
      society: { morale: 95, stability: 95, education: 70 },
      resources: { food: 500, energy: 500, materials: 500, credits: 500 },
    };

    const next = Phase1SimulationService.tickMonth(state, 2201);

    expect(next.inheritanceHistory.length).toBe(1);
    expect(next.time.generation).toBe(2);
    expect(next.currentLeaderIndex).toBe(1);
  });
});
