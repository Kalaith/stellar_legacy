// types/game.ts
import type { TabIdType, SystemStatusType, NotificationTypeType, PlanetTypeType, CrewRoleType, ComponentCategoryType } from './enums';
export interface Resources {
  credits: number;
  energy: number;
  minerals: number;
  food: number;
  influence: number;
}

export interface ShipStats {
  speed: number;
  cargo: number;
  combat: number;
  research: number;
  crewCapacity: number;
}

export interface ShipComponents {
  engine: string;
  cargo: string;
  weapons: string;
  research: string;
  quarters: string;
}

export interface Ship {
  name: string;
  hull: string;
  components: ShipComponents;
  stats: ShipStats;
}

export interface CrewMember {
  id: number;
  name: string;
  role: CrewRoleType;
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
}

export interface Planet {
  name: string;
  type: PlanetTypeType;
  resources: string[];
  developed: boolean;
}

export interface StarSystem {
  name: string;
  status: SystemStatusType;
  planets: Planet[];
  tradeRoutes: any[]; // TODO: Define trade route type
  coordinates: {
    x: number;
    y: number;
  };
}

export interface Market {
  prices: {
    minerals: number;
    energy: number;
    food: number;
    influence: number;
  };
  trends: {
    minerals: string;
    energy: string;
    food: string;
    influence: string;
  };
}

export interface Legacy {
  generation: number;
  familyName: string;
  achievements: string[];
  traits: string[];
  reputation: {
    military: number;
    traders: number;
    scientists: number;
  };
}

export interface ComponentCost {
  credits?: number;
  minerals?: number;
  energy?: number;
  food?: number;
}

export interface ComponentStats {
  speed?: number;
  cargo?: number;
  combat?: number;
  research?: number;
  crewCapacity?: number;
}

export interface ShipComponent {
  name: string;
  cost: ComponentCost;
  stats: ComponentStats;
}

export interface ShipComponentsData {
  hulls: ShipComponent[];
  engines: ShipComponent[];
  weapons: ShipComponent[];
}

export interface GameData {
  resources: Resources;
  ship: Ship;
  crew: CrewMember[];
  starSystems: StarSystem[];
  market: Market;
  legacy: Legacy;
  shipComponents: ShipComponentsData;
}

export interface GameState extends GameData {
  selectedSystem: StarSystem | null;
  currentComponentCategory: ComponentCategoryType;
  resourceGenerationRate: Partial<Resources>;
  currentTab: TabIdType;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationTypeType;
  timestamp: number;
}