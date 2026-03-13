# Stellar Legacy Development Plan

## 1) Define the “Core Game” Vertical Slice (2–4 weeks)
Build one full playable loop with simplified numbers/UI:

- One ship
- 3 generations of leadership
- 1 long-term contract (40–80 years)
- Core resources (food, energy, materials, credits)
- Basic society stats (morale, stability, education)
- End states: success, partial success, failure/abandonment

**Goal:** prove the fantasy works before scaling content.

### Phase 1 kickoff status (started)
- [x] Plan captured in `plan.md`
- [x] Phase 1 implementation brief created in `docs/phase-1-vertical-slice.md`
- [ ] Vertical slice backlog tickets split into implementation tasks
- [ ] First playable loop wired end-to-end in prototype UI

## 2) Lock the Simulation Model (foundational)
Design the simulation as explicit systems with clear interfaces:

- Time System: monthly ticks + annual reviews + generation transitions
- Population System: families, aging, births/deaths, workforce availability
- Leadership System: captain/officers traits, retirement/death, succession
- Promise/Contract System: obligations, deadlines, penalties, reputation impact
- Ship Economy System: production/consumption/storage/trade
- Society System: morale, unrest, education pipeline, housing pressure
- Legacy System: inherited assets/debts/reputation + unresolved promises

**Deliverables:**
- System diagrams
- Data schema for all core entities
- One-page balancing assumptions per system

## 3) Implement the Core Gameplay Loop End-to-End
Map each loop step to concrete mechanics:

1. Accept mission
   - Contract generation with rewards, risks, multi-decade timeline
2. Prepare ship and finances
   - Budgeting, cargo selection, staffing priorities
3. Journey + crises
   - Random/event-driven shortages, politics, accidents, opportunity events
4. Resolve contract
   - Success tiers; abandonment option with long-tail consequences
5. Expand legacy
   - Ship upgrades, route claims, influence gains/losses
6. Handover
   - Leadership succession + inherited state snapshot

## 4) Prioritized Feature Backlog (in order)
### Phase A — Must-have “promise keepers”
- Generational succession
- Long contract timelines
- Inherited consequences (debt/reputation/promises)
- Core survival economy

### Phase B — Depth multipliers
- Factions/classes aboard ship
- Heir grooming/education choices
- Trade route relationships and monopolies
- Political pressure from external powers

### Phase C — Differentiators
- Multi-ship legacy houses
- Cultural drift over centuries
- Historical chronicle / timeline replay
- Contract negotiation meta-game

## 5) Content Architecture (so expansion stays cheap)
Use data-driven content from day one:

- Contracts, events, traits, upgrades in data files (not hardcoded)
- Event tags (resource crisis, political, family, external trade, mutiny risk)
- Modifiable difficulty curves by mission era length
- Localization-friendly text keys

## 6) UX Plan for Clarity Over Centuries
Players must understand long consequences quickly:

- Top HUD: current year, generation, active promises
- Legacy Panel: what is being inherited next handover
- Promise Tracker: explicit “made by X, due by Y, at risk because Z”
- Timeline View: major ship events + leadership changes
- Forecast UI: 5/10/20-year projections for key resources

## 7) Milestones & Exit Criteria
### Milestone 1: Prototype Sim Core
- Headless simulation runs 100 years without breaking
- Leadership transitions occur correctly
- Contract can succeed/fail based on sim state

### Milestone 2: Playable Vertical Slice
- Full loop playable in UI
- 60–90 minutes of meaningful decisions
- At least 10 event types + 1 contract family

### Milestone 3: Balance Pass Alpha
- No dominant “always best” strategy
- Failure states are understandable, not random-feeling
- Legacy decisions visibly matter 1–2 generations later

### Milestone 4: Content Expansion Beta
- 3+ contract archetypes
- 3+ faction/political dynamics
- Ship upgrade trees + route strategy depth

## 8) Team Workflow (even solo-friendly)
Weekly cycle:

- Mon: system target + design constraints
- Tue–Thu: implementation
- Fri: playtest + telemetry review + rebalance

Maintain:

- Decision log (what changed and why)
- Balance changelog
- “Fantasy checks” list (does this reinforce generational legacy?)

## 9) Risk Register (watch early)
- Risk: too much simulation, too little agency  
  Mitigation: ensure every year includes meaningful strategic choices

- Risk: time scale becomes abstract and emotionless  
  Mitigation: tie systems to named families/leaders and promises

- Risk: onboarding complexity  
  Mitigation: staged unlocks + guided first contract

- Risk: balancing snowball economies  
  Mitigation: maintenance, social strain, political backlash mechanics

## 10) Immediate Next 2 Weeks (actionable)
- Write the minimal simulation spec (time, population, contracts, inheritance).
- Build headless tick engine with deterministic seed.
- Implement one contract type + one inheritance cycle.
- Add basic UI: year, resources, leadership, promise tracker.
- Create 8–12 events (shortage, scandal, birth boom, strike, breakthrough).
- Run 20 simulated campaigns and tune obvious balance failures.
- Play one manual campaign end-to-end; capture pain points.
