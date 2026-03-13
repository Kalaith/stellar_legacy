# Phase 1 — Core Game Vertical Slice (Kickoff)

## Objective
Deliver one complete, playable generational loop in 2–4 weeks that validates the central fantasy: promises and consequences surviving leadership turnover.

## Scope (locked for this phase)
- 1 ship profile
- 3 leadership generations
- 1 long-term contract (target span: 40–80 years)
- Core resources only: food, energy, materials, credits
- Core social stats only: morale, stability, education
- End states: success, partial success, failure/abandonment

## Implementation breakdown

### Workstream A — Simulation foundation
1. Time model with monthly ticks and annual review checkpoints.
2. Leadership lifecycle with succession trigger rules.
3. Contract state machine (active, at-risk, completed, abandoned).

### Workstream B — Economy + society minimums
1. Resource production/consumption pass each tick.
2. Workforce pressure tied to education and morale.
3. Stability pressure from shortages and missed obligations.

### Workstream C — Player loop wiring
1. Mission acceptance setup screen.
2. Basic operation screen with year, resources, leader, active promise state.
3. Contract resolution + summary screen with legacy carryover snapshot.

## Exit criteria for Phase 1
- A single run can progress through 3 leadership generations.
- The same contract can complete in one of 3 outcomes: success, partial, fail/abandon.
- Player decisions in early years are reflected in the inherited state at handover.

## Immediate execution queue
1. Define TypeScript interfaces for contract, leadership, and inherited state.
2. Add deterministic seed support to the tick simulation loop.
3. Create first contract template and outcome scoring rules.
4. Add UI widgets for: current year, generation index, and promise tracker.
5. Build a scripted test scenario that reaches one leadership handover.
