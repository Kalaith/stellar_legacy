import type {
  ContractOutcome,
  InheritanceSnapshot,
  LeadershipProfile,
  LongTermContract,
  Phase1ResourceState,
  Phase1SocietyState,
  Phase1TimeState,
  WorkforceState,
} from '../types/phase1Simulation';

export interface Phase1Event {
  id: string;
  year: number;
  month: number;
  title: string;
  effectSummary: string;
}

export interface Phase1SimulationState {
  time: Phase1TimeState;
  resources: Phase1ResourceState;
  society: Phase1SocietyState;
  workforce: WorkforceState;
  leaders: LeadershipProfile[];
  currentLeaderIndex: number;
  contract: LongTermContract;
  inheritanceHistory: InheritanceSnapshot[];
  activePromises: string[];
  unresolvedPromises: string[];
  reputation: number;
  debt: number;
  events: Phase1Event[];
  isComplete: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const createRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const EVENT_TEMPLATES = [
  'Hydroponics Shortage',
  'Quartermaster Scandal',
  'Birth Boom',
  'Dockworker Strike',
  'Reactor Breakthrough',
  'Radiation Leak',
  'Pilgrim Delegation',
  'Hull Microfracture',
  'Education Grant',
  'Smuggling Ring Exposed',
];

const applyMonthlyEconomy = (state: Phase1SimulationState): void => {
  const workforceFactor = state.workforce.workforceAvailable / 500;
  const educationFactor = state.society.education / 100;

  state.resources.food += Math.round(10 * workforceFactor);
  state.resources.energy += Math.round(9 * educationFactor);
  state.resources.materials += Math.round(6 * workforceFactor);
  state.resources.credits += 5;

  state.resources.food -= 12;
  state.resources.energy -= 11;
  state.resources.materials -= 4;
  state.resources.credits -= 6;

  if (state.resources.food < 30) {
    state.society.morale -= 2;
    state.society.stability -= 1;
  }
  if (state.resources.energy < 25) {
    state.society.stability -= 2;
  }

  state.resources.food = Math.max(0, state.resources.food);
  state.resources.energy = Math.max(0, state.resources.energy);
  state.resources.materials = Math.max(0, state.resources.materials);
};

const maybeTriggerEvent = (state: Phase1SimulationState, rng: () => number): void => {
  if (rng() > 0.2) return;

  const title = EVENT_TEMPLATES[Math.floor(rng() * EVENT_TEMPLATES.length)] ?? EVENT_TEMPLATES[0];
  const roll = rng();

  if (roll < 0.25) {
    state.resources.food = Math.max(0, state.resources.food - 18);
    state.society.morale -= 3;
  } else if (roll < 0.5) {
    state.resources.energy = Math.max(0, state.resources.energy - 16);
    state.society.stability -= 3;
  } else if (roll < 0.75) {
    state.resources.materials += 12;
    state.resources.credits += 8;
    state.society.education += 1;
  } else {
    state.society.morale += 3;
    state.society.stability += 2;
    state.reputation += 1;
  }

  state.events.unshift({
    id: `evt-${state.time.tick}-${Math.floor(rng() * 1000)}`,
    year: state.time.year,
    month: state.time.month,
    title,
    effectSummary: `M:${state.society.morale} S:${state.society.stability} E:${state.society.education}`,
  });

  state.events = state.events.slice(0, 12);
};

const runAnnualReview = (state: Phase1SimulationState): void => {
  state.workforce.population += Math.round(state.workforce.population * state.workforce.birthRate);
  state.workforce.population -= Math.round(state.workforce.population * state.workforce.deathRate);
  state.workforce.workforceAvailable = Math.round(state.workforce.population * 0.52);

  state.society.education = clamp(state.society.education + 1, 0, 100);
  state.society.morale = clamp(state.society.morale, 0, 100);
  state.society.stability = clamp(state.society.stability, 0, 100);

  if (state.time.year >= state.contract.dueYear && state.contract.outcome === null) {
    const score =
      state.resources.credits +
      state.resources.materials +
      state.society.morale +
      state.society.stability +
      state.reputation -
      state.debt;

    if (score > 520) {
      state.contract.outcome = 'success';
    } else if (score > 420) {
      state.contract.outcome = 'partial-success';
    } else {
      state.contract.outcome = 'failure';
    }

    state.isComplete = true;
  }
};

const maybeHandover = (state: Phase1SimulationState): void => {
  const currentLeader = state.leaders[state.currentLeaderIndex];
  if (!currentLeader || state.time.year < currentLeader.expectedEndYear) return;

  const nextIndex = state.currentLeaderIndex + 1;
  if (nextIndex >= state.leaders.length) return;

  const nextLeader = state.leaders[nextIndex];
  state.inheritanceHistory.push({
    outgoingLeaderId: currentLeader.id,
    incomingLeaderId: nextLeader.id,
    year: state.time.year,
    inheritedResources: { ...state.resources },
    inheritedSociety: { ...state.society },
    unresolvedPromises: [...state.unresolvedPromises],
    inheritedDebt: state.debt,
    inheritedReputation: state.reputation,
  });

  state.currentLeaderIndex = nextIndex;
  state.time.generation = nextIndex === 1 ? 2 : 3;

  state.society.morale = clamp(state.society.morale + 2, 0, 100);
};

export class Phase1SimulationService {
  static createInitialState(seed = 42): Phase1SimulationState {
    const startYear = 2200;
    const durationYears = 60;

    return {
      time: {
        year: startYear,
        month: 1,
        tick: 0,
        generation: 1,
      },
      resources: {
        food: 140,
        energy: 130,
        materials: 95,
        credits: 160,
      },
      society: {
        morale: 72,
        stability: 68,
        education: 55,
      },
      workforce: {
        population: 980,
        workforceAvailable: 510,
        birthRate: 0.01,
        deathRate: 0.008,
      },
      leaders: [
        {
          id: 'ldr-01',
          name: 'Captain Aria Voss',
          startYear,
          expectedEndYear: startYear + 20,
          stewardship: 74,
          riskTolerance: 45,
        },
        {
          id: 'ldr-02',
          name: 'Captain Ilyan Voss',
          startYear: startYear + 20,
          expectedEndYear: startYear + 40,
          stewardship: 69,
          riskTolerance: 61,
        },
        {
          id: 'ldr-03',
          name: 'Captain Sera Voss',
          startYear: startYear + 40,
          expectedEndYear: startYear + 60,
          stewardship: 77,
          riskTolerance: 53,
        },
      ],
      currentLeaderIndex: 0,
      contract: {
        id: 'ctr-helios-01',
        issuer: 'Helios Accord',
        title: 'Century Grain Corridor',
        startYear,
        dueYear: startYear + durationYears,
        durationYears,
        obligations: [
          'Maintain food exports above threshold for 6 annual checkpoints',
          'Deliver emergency relief cargo in crisis years',
        ],
        rewardCredits: 300,
        penaltyCredits: 180,
        outcome: null,
      },
      inheritanceHistory: [],
      activePromises: ['Sustain Helios relief corridor through contract end'],
      unresolvedPromises: ['Stabilize education pipeline above 60'],
      reputation: 50,
      debt: 40,
      events: [],
      isComplete: false,
    };
  }

  static tickMonth(state: Phase1SimulationState, seed: number): Phase1SimulationState {
    if (state.isComplete) return state;

    const next = structuredClone(state);
    const rng = createRng(seed + next.time.tick + 1);

    next.time.tick += 1;
    applyMonthlyEconomy(next);
    maybeTriggerEvent(next, rng);

    next.time.month += 1;
    if (next.time.month > 12) {
      next.time.month = 1;
      next.time.year += 1;
      runAnnualReview(next);
      maybeHandover(next);
    }

    if (next.society.stability < 20 || next.society.morale < 15) {
      next.contract.outcome = 'abandoned';
      next.isComplete = true;
      next.unresolvedPromises.push('Primary contract abandoned under civil strain');
      next.debt += next.contract.penaltyCredits;
      next.reputation -= 20;
    }

    return next;
  }

  static tickYear(state: Phase1SimulationState, seed: number): Phase1SimulationState {
    let next = state;
    for (let i = 0; i < 12 && !next.isComplete; i += 1) {
      next = this.tickMonth(next, seed + i);
    }
    return next;
  }

  static getOutcomeLabel(outcome: ContractOutcome | null): string {
    switch (outcome) {
      case 'success':
        return 'SUCCESS';
      case 'partial-success':
        return 'PARTIAL SUCCESS';
      case 'failure':
        return 'FAILURE';
      case 'abandoned':
        return 'ABANDONED';
      default:
        return 'IN PROGRESS';
    }
  }
}
