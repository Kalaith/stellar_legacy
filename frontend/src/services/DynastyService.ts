// services/DynastyService.ts
import type {
  Dynasty,
  DynastyMember,
  StoryThread,
  PopulationCohort,
  ExtendedResources,
  AIDecision,
  MissionEvent
} from '../types/generationalMissions';
import type { LegacyTypeType, CohortTypeType } from '../types/enums';
import Logger from '../utils/logger';

interface DynastyDecisionContext {
  availableResources: ExtendedResources;
  currentCrisis?: MissionEvent;
  populationNeeds: string[];
}

export class DynastyService {
  private static readonly DYNASTY_NAMES = {
    preservers: [
      'Chen', 'Rodriguez', 'Anderson', 'Kim', 'Okafor', 'Singh',
      'Mueller', 'Yamamoto', 'Santos', 'Petrov'
    ],
    adaptors: [
      'Helix', 'Strand', 'Nexus', 'Prime', 'Vex', 'Zara',
      'Kaine', 'Flux', 'Nova', 'Arc'
    ],
    wanderers: [
      'Drift', 'Void', 'Star', 'Wind', 'Path', 'Journey',
      'Horizon', 'Nomad', 'Traverse', 'Wander'
    ]
  };

  private static readonly SPECIALIZATIONS = [
    'Engineering', 'Agriculture', 'Research', 'Security', 'Diplomacy',
    'Medicine', 'Navigation', 'Trade', 'Culture', 'Education'
  ];

  private static readonly TRAITS = {
    preservers: [
      'Traditional Wisdom', 'Cultural Guardian', 'Historical Memory',
      'Steady Leadership', 'Heritage Keeper'
    ],
    adaptors: [
      'Genetic Innovation', 'Adaptive Thinking', 'Evolution Mastery',
      'Biological Enhancement', 'Mutation Resistance'
    ],
    wanderers: [
      'Deep Space Intuition', 'Resource Conservation', 'Survival Instinct',
      'Fleet Coordination', 'Void Navigation'
    ]
  };

  // Generate Initial Dynasties for a Mission
  static generateInitialDynasties(
    legacy: LegacyTypeType,
    populationSize: number
  ): Dynasty[] {
    const dynastyCount = Math.min(8, Math.max(5, Math.floor(populationSize / 5000)));
    const dynasties: Dynasty[] = [];

    for (let i = 0; i < dynastyCount; i++) {
      const dynasty = this.createDynasty(legacy, i === 0); // First dynasty starts as leaders
      dynasties.push(dynasty);
    }

    return dynasties;
  }

  // Create a Single Dynasty
  private static createDynasty(legacy: LegacyTypeType, isLeadership: boolean = false): Dynasty {
    const names = this.DYNASTY_NAMES[legacy];
    const traits = this.TRAITS[legacy];
    const name = names[Math.floor(Math.random() * names.length)];
    const specialization = isLeadership ?
      'Leadership' :
      this.SPECIALIZATIONS[Math.floor(Math.random() * this.SPECIALIZATIONS.length)];

    const leader = this.generateDynastyMember(name, specialization, true, legacy);

    const dynasty: Dynasty = {
      id: `dynasty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `House ${name}`,
      familyLine: name,
      currentLeader: leader,
      members: [leader],
      influence: isLeadership ? 85 : Math.floor(Math.random() * 40) + 20,
      specialization,
      legacyTraits: [traits[Math.floor(Math.random() * traits.length)]],
      storyThreads: this.generateInitialStoryThreads(name, specialization),
      generationsActive: 1
    };

    // Add 2-4 additional family members
    const memberCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < memberCount; i++) {
      const member = this.generateDynastyMember(name, specialization, false, legacy);
      dynasty.members.push(member);
    }

    return dynasty;
  }

  // Generate Dynasty Member
  private static generateDynastyMember(
    familyName: string,
    specialization: string,
    isLeader: boolean,
    legacy: LegacyTypeType
  ): DynastyMember {
    const firstNames = [
      'Alex', 'Morgan', 'Casey', 'Jordan', 'Taylor', 'Riley',
      'Avery', 'Cameron', 'Quinn', 'Sage', 'River', 'Phoenix'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const age = isLeader ? Math.floor(Math.random() * 20) + 35 : Math.floor(Math.random() * 40) + 20;

    const member: DynastyMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${firstName} ${familyName}`,
      age,
      role: isLeader ? 'Dynasty Head' : this.getRandomRole(specialization),
      skills: this.generateSkills(specialization, isLeader),
      traits: this.generateMemberTraits(legacy, specialization),
      isLeader
    };

    return member;
  }

  // Generate Skills Based on Specialization
  private static generateSkills(specialization: string, isLeader: boolean): Record<string, number> {
    const baseSkill = isLeader ? 6 : 4;
    const skills = {
      leadership: baseSkill + (isLeader ? 3 : 0),
      technical: baseSkill,
      social: baseSkill,
      survival: baseSkill,
      innovation: baseSkill
    };

    // Boost skills based on specialization
    switch (specialization) {
      case 'Engineering':
      case 'Research':
        skills.technical += 3;
        skills.innovation += 2;
        break;
      case 'Agriculture':
      case 'Medicine':
        skills.technical += 2;
        skills.survival += 2;
        break;
      case 'Security':
      case 'Navigation':
        skills.survival += 3;
        skills.leadership += 1;
        break;
      case 'Diplomacy':
      case 'Trade':
        skills.social += 3;
        skills.leadership += 1;
        break;
      case 'Leadership':
        skills.leadership += 2;
        skills.social += 2;
        break;
    }

    // Add some randomization
    Object.keys(skills).forEach(skill => {
      skills[skill as keyof typeof skills] += Math.floor(Math.random() * 3) - 1;
      skills[skill as keyof typeof skills] = Math.max(1, Math.min(10, skills[skill as keyof typeof skills]));
    });

    return skills;
  }

  // Generate Member Traits
  private static generateMemberTraits(legacy: LegacyTypeType, specialization: string): string[] {
    const legacyTraits = this.TRAITS[legacy];
    const traits: string[] = [];

    // Add one legacy-specific trait
    traits.push(legacyTraits[Math.floor(Math.random() * legacyTraits.length)]);

    // Add specialization trait
    const specializationTraits: Record<string, string[]> = {
      'Engineering': ['Technical Genius', 'System Optimizer', 'Problem Solver'],
      'Agriculture': ['Life Cultivator', 'Resource Manager', 'Ecosystem Guardian'],
      'Research': ['Knowledge Seeker', 'Data Analyst', 'Theory Crafter'],
      'Security': ['Threat Assessor', 'Tactical Thinker', 'Guardian Spirit'],
      'Diplomacy': ['Negotiator', 'Cultural Bridge', 'Conflict Resolver'],
      'Medicine': ['Life Saver', 'Compassionate Healer', 'Biological Expert'],
      'Navigation': ['Star Reader', 'Path Finder', 'Void Walker'],
      'Trade': ['Market Analyst', 'Resource Optimizer', 'Deal Maker'],
      'Leadership': ['Natural Leader', 'Strategic Thinker', 'Inspiring Presence']
    };

    const specTraits = specializationTraits[specialization] || ['Dedicated Professional'];
    traits.push(specTraits[Math.floor(Math.random() * specTraits.length)]);

    return traits;
  }

  // Generate Random Role
  private static getRandomRole(specialization: string): string {
    const roles: Record<string, string[]> = {
      'Engineering': ['Chief Engineer', 'Systems Specialist', 'Maintenance Lead'],
      'Agriculture': ['Food Production Manager', 'Hydroponics Specialist', 'Nutrition Officer'],
      'Research': ['Senior Researcher', 'Data Analyst', 'Laboratory Director'],
      'Security': ['Security Chief', 'Defense Coordinator', 'Safety Officer'],
      'Diplomacy': ['Cultural Liaison', 'Negotiator', 'Community Relations'],
      'Medicine': ['Chief Medical Officer', 'Health Coordinator', 'Medical Specialist'],
      'Navigation': ['Navigation Officer', 'Stellar Cartographer', 'Pilot Coordinator'],
      'Trade': ['Resource Manager', 'Supply Chain Coordinator', 'Economic Advisor'],
      'Leadership': ['Department Head', 'Council Member', 'Administrative Officer']
    };

    const roleOptions = roles[specialization] || ['Specialist', 'Coordinator', 'Officer'];
    return roleOptions[Math.floor(Math.random() * roleOptions.length)];
  }

  // Generate Initial Story Threads
  private static generateInitialStoryThreads(familyName: string, specialization: string): StoryThread[] {
    const threads: StoryThread[] = [];

    // Family origin story
    threads.push({
      id: `story_origin_${Date.now()}`,
      title: `The ${familyName} Legacy`,
      description: `How House ${familyName} rose to prominence in ${specialization}`,
      isActive: true,
      generationsActive: 1
    });

    // Specialization challenge
    const challenges: Record<string, string> = {
      'Engineering': 'The Great Breakdown - Can they keep the ship systems running?',
      'Agriculture': 'The Hunger Crisis - Will they solve the food shortage?',
      'Research': 'The Unknown Discovery - What secrets will they uncover?',
      'Security': 'The Silent Threat - Can they protect the mission?',
      'Leadership': 'The Unity Challenge - Will they hold the community together?'
    };

    const challenge = challenges[specialization] || 'The Professional Challenge - Will they excel in their field?';

    threads.push({
      id: `story_challenge_${Date.now()}`,
      title: challenge.split(' - ')[0],
      description: challenge,
      isActive: true,
      generationsActive: 1
    });

    return threads;
  }

  // AI Decision Making for Dynasty Management
  static makeAutomatedDecision(
    dynasty: Dynasty,
    context: DynastyDecisionContext
  ): AIDecision {
    const decision = this.evaluateDecisionOptions(dynasty, context);

    const aiDecision: AIDecision = {
      id: `ai_decision_${Date.now()}`,
      category: dynasty.specialization,
      decision: decision.action,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      timestamp: Date.now(),
      wasOverridden: false,
      outcome: null
    };

    Logger.info(`AI Decision by ${dynasty.name}: ${decision.action}`, {
      reasoning: decision.reasoning,
      confidence: decision.confidence
    });

    return aiDecision;
  }

  // Evaluate Decision Options for AI
  private static evaluateDecisionOptions(
    dynasty: Dynasty,
    context: DynastyDecisionContext
  ): { action: string; reasoning: string; confidence: number } {
    const specialization = dynasty.specialization;

    // Simple AI decision logic based on specialization and current context
    switch (specialization) {
      case 'Engineering':
        if (context.currentCrisis?.title.includes('System')) {
          return {
            action: 'Emergency Repairs',
            reasoning: 'System crisis detected, applying engineering expertise',
            confidence: 0.85
          };
        }
        return {
          action: 'Routine Maintenance',
          reasoning: 'No immediate crisis, performing preventive maintenance',
          confidence: 0.7
        };

      case 'Agriculture':
        if (context.populationNeeds.includes('food')) {
          return {
            action: 'Increase Food Production',
            reasoning: 'Food shortage detected, boosting agricultural output',
            confidence: 0.9
          };
        }
        return {
          action: 'Optimize Crop Cycles',
          reasoning: 'Steady state, improving efficiency',
          confidence: 0.75
        };

      case 'Security':
        if (context.currentCrisis?.category === 'immediate_crisis') {
          return {
            action: 'Implement Security Protocols',
            reasoning: 'Crisis situation requires enhanced security measures',
            confidence: 0.8
          };
        }
        return {
          action: 'Regular Security Patrols',
          reasoning: 'Maintaining security awareness',
          confidence: 0.65
        };

      default:
        return {
          action: 'Standard Operations',
          reasoning: `Continuing ${specialization} duties as normal`,
          confidence: 0.6
        };
    }
  }

  // Advance Dynasty Through Generation
  static advanceGeneration(dynasty: Dynasty): Dynasty {
    const updatedDynasty = { ...dynasty };

    // Age all members
    updatedDynasty.members = dynasty.members.map(member => ({
      ...member,
      age: member.age + 25 // Average generation length
    }));

    // Check if leader needs succession
    if (updatedDynasty.currentLeader.age > 70) {
      const successors = updatedDynasty.members.filter(m =>
        m.age >= 30 && m.age <= 50 && !m.isLeader
      );

      if (successors.length > 0) {
        // Choose successor with highest leadership skill
        const newLeader = successors.reduce((best, current) =>
          current.skills.leadership > best.skills.leadership ? current : best
        );

        updatedDynasty.currentLeader = { ...newLeader, isLeader: true };
        updatedDynasty.members = updatedDynasty.members.map(m => ({
          ...m,
          isLeader: m.id === newLeader.id
        }));
      }
    }

    // Add new generation members
    const newMemberCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < newMemberCount; i++) {
      const newMember = this.generateDynastyMember(
        dynasty.familyLine,
        dynasty.specialization,
        false,
        'preservers' as LegacyTypeType // Default legacy, should be passed in
      );
      newMember.age = Math.floor(Math.random() * 25) + 18; // Young adults
      updatedDynasty.members.push(newMember);
    }

    updatedDynasty.generationsActive += 1;

    return updatedDynasty;
  }

  // Manage Cohort Assignment
  static assignDynasTiesToCohorts(
    dynasties: Dynasty[],
    cohorts: PopulationCohort[]
  ): PopulationCohort[] {
    return cohorts.map(cohort => {
      const relevantDynasty = dynasties.find(d =>
        this.isRelevantSpecialization(d.specialization, cohort.type)
      );

      if (relevantDynasty) {
        const leaderEffectiveness = relevantDynasty.currentLeader.skills.leadership / 10;
        const influenceBonus = relevantDynasty.influence / 100;

        return {
          ...cohort,
          effectiveness: Math.min(1.0, cohort.effectiveness + leaderEffectiveness + influenceBonus)
        };
      }

      return cohort;
    });
  }

  // Check if Dynasty Specialization is Relevant to Cohort
  private static isRelevantSpecialization(specialization: string, cohortType: CohortTypeType): boolean {
    const relevanceMap: Record<string, CohortTypeType[]> = {
      'Engineering': ['engineers'],
      'Agriculture': ['farmers'],
      'Research': ['scholars'],
      'Security': ['security'],
      'Leadership': ['leaders', 'general'],
      'Medicine': ['general'],
      'Navigation': ['general'],
      'Trade': ['general'],
      'Diplomacy': ['leaders']
    };

    return relevanceMap[specialization]?.includes(cohortType) || false;
  }

  // Track AI Performance
  static updateAIPerformance(
    decision: AIDecision,
    outcome: 'success' | 'failure' | 'neutral'
  ): void {
    decision.outcome = outcome;

    // In a real implementation, this would update performance metrics
    Logger.info(`AI Decision outcome: ${outcome}`, {
      decisionId: decision.id,
      category: decision.category
    });
  }
}
