export type ContractOutcome = 'success' | 'partial-success' | 'failure' | 'abandoned';

export interface Phase1TimeState {
  year: number;
  month: number;
  tick: number;
  generation: 1 | 2 | 3;
}

export interface LeadershipProfile {
  id: string;
  name: string;
  startYear: number;
  expectedEndYear: number;
  stewardship: number;
  riskTolerance: number;
}

export interface Phase1ResourceState {
  food: number;
  energy: number;
  materials: number;
  credits: number;
}

export interface Phase1SocietyState {
  morale: number;
  stability: number;
  education: number;
}

export interface WorkforceState {
  population: number;
  workforceAvailable: number;
  birthRate: number;
  deathRate: number;
}

export interface LongTermContract {
  id: string;
  issuer: string;
  title: string;
  startYear: number;
  dueYear: number;
  durationYears: number;
  obligations: string[];
  rewardCredits: number;
  penaltyCredits: number;
  outcome: ContractOutcome | null;
}

export interface InheritanceSnapshot {
  outgoingLeaderId: string;
  incomingLeaderId: string;
  year: number;
  inheritedResources: Phase1ResourceState;
  inheritedSociety: Phase1SocietyState;
  unresolvedPromises: string[];
  inheritedDebt: number;
  inheritedReputation: number;
}
