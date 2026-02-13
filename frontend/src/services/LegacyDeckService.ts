
// services/LegacyDeckService.ts
import type {
  LegacyDeck,
  LegacyCard,
  LegacyCardTemplate,
  EffectTemplate,
  CardTriggerResult,
  CardResolutionResult,
  DeckAnalytics,
  DeckBalanceReport,
  BalanceIssue,
  CardModification,
  CurationAction,
  CardChoice,
  CardEffect,
  CardTrigger,
  CardTier,
  CardType,
} from '../types/legacyDecks';
import type {
  ChronicleEntry,
  ChronicleDecision,
  ChronicleArtifact,
} from '../types/chronicle';
import type { GenerationalMission } from '../types/generationalMissions';
import Logger from '../utils/logger';

export class LegacyDeckService {
  private static readonly DECK_STORAGE_KEY = 'stellar-legacy-decks';
  private static readonly VERSION = '1.0.0';

  /**
   * Generate legacy cards from a chronicle entry
   */
  static generateCardsFromChronicle(
    entry: ChronicleEntry
  ): LegacyCardTemplate[] {
    const templates: LegacyCardTemplate[] = [];

    try {
      // Generate cards from key decisions
      entry.keyDecisions.forEach(decision => {
        if (decision.chronicleWeight >= 0.6) {
          const template = this.createCardFromDecision(decision, entry);
          if (template) templates.push(template);
        }
      });

      // Generate cards from artifacts
      entry.artifacts.forEach(artifact => {
        const template = this.createCardFromArtifact(artifact, entry);
        if (template) templates.push(template);
      });

      // Generate cards from discoveries
      entry.discoveries.forEach(discovery => {
        if (discovery.significance >= 0.7) {
          const template = this.createCardFromDiscovery(discovery, entry);
          if (template) templates.push(template);
        }
      });

      // Generate cards from legacy evolution
      entry.legacyEvolution.forEach(evolution => {
        if (evolution.deviationMagnitude > 0.5) {
          const template = this.createCardFromEvolution(evolution, entry);
          if (template) templates.push(template);
        }
      });

      // Generate cards from population outcome
      if (entry.populationOutcome !== 'survived') {
        const template = this.createCardFromPopulationOutcome(entry);
        if (template) templates.push(template);
      }

      Logger.info('Generated legacy cards from chronicle', {
        chronicleEntry: entry.missionId,
        cardCount: templates.length,
      });

      return templates;
    } catch (error) {
      Logger.error('Failed to generate cards from chronicle', error);
      return [];
    }
  }

  /**
   * Check if any cards should trigger based on current game state
   */
  static checkCardTriggers(
    deck: LegacyDeck,
    gameState: GenerationalMission
  ): CardTriggerResult[] {
    const triggeredCards: CardTriggerResult[] = [];

    try {
      const availableCards = deck.cards.filter(
        card =>
          !deck.activeCards.includes(card.id) &&
          !deck.discardPile.includes(card.id) &&
          !deck.disabledCards.includes(card.id)
      );

      availableCards.forEach(card => {
        const triggerResult = this.evaluateCardTriggers(card, gameState);
        if (triggerResult.success) {
          triggeredCards.push(triggerResult);
        }
      });

      // Sort by priority and probability
      triggeredCards.sort((a, b) => {
        const priorityA = this.calculateCardPriority(a.card, gameState);
        const priorityB = this.calculateCardPriority(b.card, gameState);
        return priorityB - priorityA;
      });

      Logger.info('Card trigger check completed', {
        missionId: gameState.id,
        availableCards: availableCards.length,
        triggeredCards: triggeredCards.length,
      });

      return triggeredCards;
    } catch (error) {
      Logger.error('Failed to check card triggers', error);
      return [];
    }
  }

  /**
   * Resolve a card choice and apply its effects
   */
  static resolveCardChoice(
    card: LegacyCard,
    choice: CardChoice,
    gameState: GenerationalMission
  ): CardResolutionResult {
    try {
      const result: CardResolutionResult = {
        chosenOption: choice,
        immediateEffects: [],
        futureEffects: [],
        narrativeOutcome: choice.outcomeText,
        legacyReactions: choice.legacyReaction,
        chronicleUpdate: choice.chronicleConsequence,
      };

      // Apply immediate effects
      choice.immediateEffects.forEach(effect => {
        this.applyCardEffect(effect, gameState);
        result.immediateEffects.push(effect);
      });

      // Store future effects for later application
      result.futureEffects = choice.longTermEffects;

      // Update card statistics
      this.updateCardStatistics(card, choice);

      Logger.info('Card choice resolved', {
        cardId: card.id,
        choiceId: choice.id,
        effectCount: result.immediateEffects.length,
      });

      return result;
    } catch (error) {
      Logger.error('Failed to resolve card choice', error);
      throw error;
    }
  }

  /**
   * Balance deck weights and card probabilities
   */
  static balanceDeck(deck: LegacyDeck): LegacyDeck {
    try {
      const analytics = this.analyzeDeck(deck);
      const balancedDeck = { ...deck };

      // Adjust card weights based on usage and player ratings
      balancedDeck.cards = deck.cards.map(card => {
        const adjustedCard = { ...card };

        // Reduce weight of overused cards
        if (card.timesPlayed > analytics.averageUsage * 2) {
          adjustedCard.weight = Math.max(0.1, card.weight * 0.8);
        }

        // Increase weight of underused but well-rated cards
        if (
          card.timesPlayed < analytics.averageUsage * 0.5 &&
          card.playerRating > 3.5
        ) {
          adjustedCard.weight = Math.min(1.0, card.weight * 1.2);
        }

        // Adjust based on player rating
        const ratingMultiplier = card.playerRating / 3; // 1-5 rating becomes 0.33-1.67 multiplier
        adjustedCard.weight = Math.max(
          0.1,
          Math.min(1.0, card.weight * ratingMultiplier)
        );

        return adjustedCard;
      });

      // Update deck statistics
      balancedDeck.balanceRating = this.calculateDeckBalance(balancedDeck);

      Logger.info('Deck balanced', {
        legacy: deck.legacy,
        cardCount: deck.cards.length,
        newBalanceRating: balancedDeck.balanceRating,
      });

      return balancedDeck;
    } catch (error) {
      Logger.error('Failed to balance deck', error);
      return deck;
    }
  }

  /**
   * Analyze deck composition and performance
   */
  static analyzeDeck(deck: LegacyDeck): DeckAnalytics {
    try {
      const tierDistribution: Record<CardTier, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      const typeDistribution: Record<CardType, number> = {
        event: 0,
        bonus: 0,
        crisis: 0,
        opportunity: 0,
        memory: 0,
        tradition: 0,
      };

      const usageFrequency: Record<string, number> = {};
      const playerSatisfactionScores: Record<string, number> = {};

      let totalPowerLevel = 0;
      let totalUsage = 0;

      deck.cards.forEach(card => {
        tierDistribution[card.tier]++;
        typeDistribution[card.type]++;
        totalPowerLevel += card.balanceMetrics?.powerLevel || 0.5;
        totalUsage += card.timesPlayed;

        usageFrequency[card.id] = card.timesPlayed;
        playerSatisfactionScores[card.id] = card.playerRating;
      });

      const averageUsage = totalUsage / deck.cards.length;
      const averagePowerLevel = totalPowerLevel / deck.cards.length;

      // Detect balance issues
      const balanceIssues = this.detectBalanceIssues(deck, {
        averageUsage,
        averagePowerLevel,
      });

      return {
        totalCards: deck.cards.length,
        tierDistribution,
        typeDistribution,
        averagePowerLevel,
        usageFrequency,
        playerSatisfactionScores,
        balanceIssues,
        averageUsage,
      };
    } catch (error) {
      Logger.error('Failed to analyze deck', error);
      return this.getEmptyAnalytics();
    }
  }

  /**
   * Generate a comprehensive deck balance report
   */
  static generateBalanceReport(deck: LegacyDeck): DeckBalanceReport {
    try {
      const analytics = this.analyzeDeck(deck);

      // Calculate overall balance score
      const overallScore = this.calculateOverallBalance(analytics);

      // Calculate power curve
      const powerCurve = this.calculatePowerCurve(deck);

      // Calculate diversity score
      const diversityScore = this.calculateDiversityScore(analytics);

      // Calculate player engagement score
      const playerEngagement = this.calculatePlayerEngagement(deck);

      // Generate recommendations
      const recommendations = this.generateBalanceRecommendations(analytics);

      return {
        overallScore,
        powerCurve,
        diversityScore,
        playerEngagement,
        issues: analytics.balanceIssues,
        recommendations,
      };
    } catch (error) {
      Logger.error('Failed to generate balance report', error);
      return {
        overallScore: 0.5,
        powerCurve: [0.2, 0.4, 0.6, 0.8, 1.0],
        diversityScore: 0.5,
        playerEngagement: 0.5,
        issues: [],
        recommendations: ['Unable to generate recommendations due to error'],
      };
    }
  }

  /**
   * Apply player curation action to a card
   */
  static applyCuration(
    deck: LegacyDeck,
    cardId: string,
    action: CurationAction,
    value?: unknown
  ): LegacyDeck {
    try {
      const newDeck = { ...deck };
      const cardIndex = newDeck.cards.findIndex(c => c.id === cardId);

      if (cardIndex === -1) {
        throw new Error(`Card ${cardId} not found in deck`);
      }

      switch (action) {
        case 'rate':
          if (typeof value === 'number' && value >= 1 && value <= 5) {
            newDeck.cardRatings[cardId] = value;
            newDeck.cards[cardIndex].playerRating = value;
          }
          break;

        case 'disable':
          if (!newDeck.disabledCards.includes(cardId)) {
            newDeck.disabledCards.push(cardId);
          }
          break;

        case 'modify':
          if (value && Array.isArray(value)) {
            const modifications = value as CardModification[];
            const modifiedCard = this.applyModifications(
              newDeck.cards[cardIndex],
              modifications
            );
            newDeck.cards[cardIndex] = modifiedCard;
          }
          break;

        case 'favorite':
          // Increase weight of favorite cards
          newDeck.cards[cardIndex].weight = Math.min(
            1.0,
            newDeck.cards[cardIndex].weight * 1.5
          );
          break;

        case 'report':
          // Log issue for review
          Logger.info('Card reported by player', { cardId, issue: value });
          break;
      }

      Logger.info('Curation applied', { cardId, action, legacy: deck.legacy });
      return newDeck;
    } catch (error) {
      Logger.error('Failed to apply curation', error);
      return deck;
    }
  }

  // Private helper methods

  private static createCardFromDecision(
    decision: ChronicleDecision,
    entry: ChronicleEntry
  ): LegacyCardTemplate | null {
    const template: LegacyCardTemplate = {
      id: this.generateCardId(),
      name: `Echo: ${decision.title}`,
      templateType: 'decision_echo',
      generationRules: {
        minimumDecisionWeight: 0.6,
        requiredElements: [decision.category],
        excludedCombinations: [],
        scalingFactors: { impact: decision.chronicleWeight },
        rarityCalculation: {
          baseRarity: this.calculateTierFromWeight(decision.chronicleWeight),
          impactModifier: decision.chronicleWeight,
          uniquenessBonus: 0.1,
          playerPreferenceWeight: 0.2,
        },
      },
      effectTemplates: this.generateEffectTemplatesFromDecision(decision),
      narrativeTemplates: [
        {
          title: decision.title,
          description: decision.description,
          flavorText: `The echoes of this decision still resonate...`,
          variables: ['legacy', 'generation', 'outcome'],
          conditions: [`legacy:${entry.dominantLegacy}`],
        },
      ],
      balancingRules: {
        maxPowerLevel: this.calculateMaxPowerFromDecision(decision),
        costFormula: 'chronicleWeight * 100',
        cooldownFormula: '(1 - chronicleWeight) * 50',
        tierAdjustments: {
          common: 0.8,
          uncommon: 0.9,
          rare: 1.0,
          epic: 1.2,
          legendary: 1.5,
        },
      },
    };

    return template;
  }

  private static createCardFromArtifact(
    _artifact: ChronicleArtifact,
    _entry: ChronicleEntry
  ): LegacyCardTemplate | null {
    // Implementation for artifact-based cards
    return null;
  }

  private static createCardFromDiscovery(
    _discovery: unknown,
    _entry: ChronicleEntry
  ): LegacyCardTemplate | null {
    // Implementation for discovery-based cards
    return null;
  }

  private static createCardFromEvolution(
    _evolution: unknown,
    _entry: ChronicleEntry
  ): LegacyCardTemplate | null {
    // Implementation for evolution-based cards
    return null;
  }

  private static createCardFromPopulationOutcome(
    _entry: ChronicleEntry
  ): LegacyCardTemplate | null {
    // Implementation for population outcome cards
    return null;
  }

  private static evaluateCardTriggers(
    card: LegacyCard,
    gameState: GenerationalMission
  ): CardTriggerResult {
    const success = card.triggerConditions.some(trigger =>
      this.evaluateTriggerCondition(trigger, gameState)
    );

    return {
      success,
      card,
      triggeredBy: success ? 'game_state_match' : 'no_trigger',
      availableChoices: success ? card.choices : [],
      context: success ? this.generateTriggerContext(card, gameState) : '',
    };
  }

  private static evaluateTriggerCondition(
    trigger: CardTrigger,
    gameState: GenerationalMission
  ): boolean {
    try {
      const condition = trigger.condition;

      switch (condition.type) {
        case 'resource': {
          const resources = gameState.resources as unknown as Record<
            string,
            unknown
          >;
          const rawValue = resources[condition.target];
          const resourceValue = typeof rawValue === 'number' ? rawValue : 0;
          return this.evaluateComparison(
            resourceValue,
            condition.operator,
            condition.value
          );
        }

        case 'population': {
          const popValue = gameState.population.total;
          return this.evaluateComparison(
            popValue,
            condition.operator,
            condition.value
          );
        }

        case 'year':
          return this.evaluateComparison(
            gameState.currentYear,
            condition.operator,
            condition.value
          );

        default:
          return false;
      }
    } catch (error) {
      Logger.error('Failed to evaluate trigger condition', error);
      return false;
    }
  }

  private static evaluateComparison(
    actual: unknown,
    operator: string,
    expected: unknown
  ): boolean {
    const aNum = typeof actual === 'number' ? actual : NaN;
    const eNum = typeof expected === 'number' ? expected : NaN;

    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'greater':
        return aNum > eNum;
      case 'less':
        return aNum < eNum;
      case 'contains':
        return String(actual).includes(String(expected));
      case 'not':
        return actual !== expected;
      default:
        return false;
    }
  }

  private static applyCardEffect(
    effect: CardEffect,
    gameState: GenerationalMission
  ): void {
    try {
      switch (effect.type) {
        case 'resource':
          if (gameState.resources) {
            const resources = gameState.resources as unknown as Record<
              string,
              unknown
            >;
            const current =
              typeof resources[effect.target] === 'number'
                ? (resources[effect.target] as number)
                : 0;
            resources[effect.target] = current + effect.magnitude;
          }
          break;

        case 'population':
          if (effect.target === 'total') {
            gameState.population.total += effect.magnitude;
          }
          break;

        // Add more effect types as needed
      }
    } catch (error) {
      Logger.error('Failed to apply card effect', error);
    }
  }

  private static calculateCardPriority(
    card: LegacyCard,
    _gameState: GenerationalMission
  ): number {
    // Calculate priority based on multiple factors
    let priority = card.weight;

    // Increase priority for cards that haven't been played recently
    if (card.timesPlayed === 0) priority *= 1.5;

    // Increase priority for well-rated cards
    if (card.playerRating > 3.5) priority *= 1.2;

    // Adjust based on card tier
    const tierMultiplier = {
      common: 1.0,
      uncommon: 1.1,
      rare: 1.2,
      epic: 1.3,
      legendary: 1.4,
    };
    priority *= tierMultiplier[card.tier];

    return priority;
  }

  private static updateCardStatistics(
    card: LegacyCard,
    choice: CardChoice
  ): void {
    card.timesPlayed++;

    // Update choice statistics
    if (!card.playerChoices[choice.id]) {
      card.playerChoices[choice.id] = 0;
    }
    card.playerChoices[choice.id]++;

    // Update effectiveness based on choice outcomes
    card.effectiveness = this.calculateCardEffectiveness(card);
  }

  private static calculateCardEffectiveness(card: LegacyCard): number {
    // Calculate effectiveness based on choice outcomes and player ratings
    const totalChoices = Object.values(card.playerChoices).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalChoices === 0) return 0.5;

    // Simple effectiveness calculation - could be more sophisticated
    return Math.min(
      1.0,
      (card.playerRating / 5) * (totalChoices / (card.timesPlayed || 1))
    );
  }

  private static calculateDeckBalance(deck: LegacyDeck): number {
    const analytics = this.analyzeDeck(deck);

    // Calculate balance based on distribution and player satisfaction
    const tierBalance = this.calculateTierBalance(analytics.tierDistribution);
    const typeBalance = this.calculateTypeBalance(analytics.typeDistribution);
    const satisfactionScore =
      Object.values(analytics.playerSatisfactionScores).reduce(
        (sum, rating) => sum + rating,
        0
      ) / Object.keys(analytics.playerSatisfactionScores).length;

    return (tierBalance + typeBalance + satisfactionScore / 5) / 3;
  }

  private static calculateTierBalance(
    distribution: Record<CardTier, number>
  ): number {
    const total = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0
    );
    if (total === 0) return 0;

    // Ideal distribution: more common cards, fewer legendary
    const ideal = {
      common: 0.4,
      uncommon: 0.3,
      rare: 0.2,
      epic: 0.08,
      legendary: 0.02,
    };

    let deviation = 0;
    Object.entries(ideal).forEach(([tier, idealRatio]) => {
      const actualRatio = distribution[tier as CardTier] / total;
      deviation += Math.abs(actualRatio - idealRatio);
    });

    return Math.max(0, 1 - deviation);
  }

  private static calculateTypeBalance(
    distribution: Record<CardType, number>
  ): number {
    const total = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0
    );
    if (total === 0) return 0;

    // Calculate how evenly distributed the types are
    const types = Object.keys(distribution).length;
    const idealRatio = 1 / types;

    let deviation = 0;
    Object.values(distribution).forEach(count => {
      const actualRatio = count / total;
      deviation += Math.abs(actualRatio - idealRatio);
    });

    return Math.max(0, 1 - deviation);
  }

  private static detectBalanceIssues(
    deck: LegacyDeck,
    metrics: { averageUsage: number; averagePowerLevel: number }
  ): BalanceIssue[] {
    const issues: BalanceIssue[] = [];

    deck.cards.forEach(card => {
      // Check for overpowered cards
      if ((card.balanceMetrics?.powerLevel || 0.5) > 0.9) {
        issues.push({
          type: 'overpowered',
          cardId: card.id,
          severity: 'major',
          description: `${card.name} has very high power level`,
          suggestedFix: 'Reduce effect magnitude or increase cost',
          automaticFix: true,
        });
      }

      // Check for underused cards
      if (
        card.timesPlayed < metrics.averageUsage * 0.2 &&
        card.playerRating < 2
      ) {
        issues.push({
          type: 'underpowered',
          cardId: card.id,
          severity: 'moderate',
          description: `${card.name} is rarely played and poorly rated`,
          suggestedFix: 'Increase power level or improve triggers',
          automaticFix: false,
        });
      }

      // Check for overused cards
      if (card.timesPlayed > metrics.averageUsage * 3) {
        issues.push({
          type: 'too_frequent',
          cardId: card.id,
          severity: 'minor',
          description: `${card.name} appears too frequently`,
          suggestedFix: 'Reduce trigger probability or add cooldown',
          automaticFix: true,
        });
      }
    });

    return issues;
  }

  private static calculateOverallBalance(analytics: DeckAnalytics): number {
    const issueScore =
      1 - analytics.balanceIssues.length / analytics.totalCards;
    const satisfactionScore =
      Object.values(analytics.playerSatisfactionScores).reduce(
        (sum, rating) => sum + rating,
        0
      ) /
      (Object.keys(analytics.playerSatisfactionScores).length * 5);

    return (issueScore + satisfactionScore) / 2;
  }

  private static calculatePowerCurve(deck: LegacyDeck): number[] {
    const tierPowers: Record<CardTier, number[]> = {
      common: [],
      uncommon: [],
      rare: [],
      epic: [],
      legendary: [],
    };

    deck.cards.forEach(card => {
      tierPowers[card.tier].push(card.balanceMetrics?.powerLevel || 0.5);
    });

    return Object.keys(tierPowers).map(tier => {
      const powers = tierPowers[tier as CardTier];
      return powers.length > 0
        ? powers.reduce((sum, p) => sum + p, 0) / powers.length
        : 0;
    });
  }

  private static calculateDiversityScore(analytics: DeckAnalytics): number {
    const typeCount = Object.values(analytics.typeDistribution).filter(
      count => count > 0
    ).length;
    const maxTypes = Object.keys(analytics.typeDistribution).length;
    return typeCount / maxTypes;
  }

  private static calculatePlayerEngagement(deck: LegacyDeck): number {
    const avgRating =
      deck.cards.reduce((sum, card) => sum + card.playerRating, 0) /
      deck.cards.length;
    return avgRating / 5; // Convert 1-5 rating to 0-1 score
  }

  private static generateBalanceRecommendations(
    analytics: DeckAnalytics
  ): string[] {
    const recommendations: string[] = [];

    if (analytics.balanceIssues.length > analytics.totalCards * 0.2) {
      recommendations.push(
        'Consider rebalancing multiple cards to improve overall deck health'
      );
    }

    const avgSatisfaction =
      Object.values(analytics.playerSatisfactionScores).reduce(
        (sum, rating) => sum + rating,
        0
      ) / Object.keys(analytics.playerSatisfactionScores).length;

    if (avgSatisfaction < 3) {
      recommendations.push(
        'Player satisfaction is low - review card design and effects'
      );
    }

    if (analytics.tierDistribution.legendary > analytics.totalCards * 0.1) {
      recommendations.push(
        'Too many legendary cards may reduce their special feeling'
      );
    }

    return recommendations;
  }

  private static applyModifications(
    card: LegacyCard,
    modifications: CardModification[]
  ): LegacyCard {
    const modifiedCard = { ...card };

    modifications.forEach(mod => {
      switch (mod.type) {
        case 'effect_magnitude':
          // Modify effect magnitudes
          break;
        case 'trigger_condition':
          // Modify trigger conditions
          break;
        case 'narrative_text':
          // Modify narrative text
          break;
        case 'rarity_adjustment':
          // Adjust rarity/tier
          break;
      }
    });

    return modifiedCard;
  }

  // Utility methods
  private static generateTriggerContext(
    card: LegacyCard,
    gameState: GenerationalMission
  ): string {
    return `${card.title} has been triggered during ${gameState.currentPhase} phase of year ${gameState.currentYear}`;
  }

  private static calculateTierFromWeight(weight: number): CardTier {
    if (weight >= 0.95) return 'legendary';
    if (weight >= 0.85) return 'epic';
    if (weight >= 0.7) return 'rare';
    if (weight >= 0.5) return 'uncommon';
    return 'common';
  }

  private static calculateMaxPowerFromDecision(
    decision: ChronicleDecision
  ): number {
    return Math.min(1.0, decision.chronicleWeight * 1.2);
  }

  private static generateEffectTemplatesFromDecision(
    _decision: ChronicleDecision
  ): EffectTemplate[] {
    // Generate effect templates based on decision category and impact
    return [];
  }

  private static getEmptyAnalytics(): DeckAnalytics {
    return {
      totalCards: 0,
      tierDistribution: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      },
      typeDistribution: {
        event: 0,
        bonus: 0,
        crisis: 0,
        opportunity: 0,
        memory: 0,
        tradition: 0,
      },
      averagePowerLevel: 0,
      usageFrequency: {},
      playerSatisfactionScores: {},
      balanceIssues: [],
      averageUsage: 0,
    };
  }

  private static generateCardId(): string {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
