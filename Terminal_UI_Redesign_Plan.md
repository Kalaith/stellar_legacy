# Terminal UI Redesign Plan - Stellar Legacy

## Vision Statement
Transform Stellar Legacy from a modern web interface into an **ancient computer terminal system** - imagine a recovered pre-space civilization computer interface that's been retrofitted for interstellar command operations. The aesthetic should blend:

- **Retro-futuristic terminal** (think Alien: Isolation, Fallout terminals)
- **Ancient computing systems** with scan lines and phosphor glow
- **Military/scientific command interface**
- **Mobile-friendly responsive design** that adapts terminal concepts to touch

## Design Philosophy

### Core Aesthetic Principles
1. **Monospace Typography**: Everything uses terminal-style fonts
2. **Limited Color Palette**: Amber/green phosphor with red warnings
3. **ASCII Art Elements**: Borders, dividers, status indicators
4. **Scan Line Effects**: CRT monitor simulation
5. **Terminal Windows**: Everything feels like command line interfaces
6. **Data-Dense Layouts**: Information-packed screens like real terminals

### Visual Language
- **Background**: Deep black with subtle scan lines
- **Primary Text**: Amber (#FFB000) or Green (#00FF00) phosphor glow
- **Secondary Text**: Dim amber (#AA7700) for less important info
- **Warnings**: Red (#FF3300) for alerts and errors
- **Success**: Bright green (#00FF66) for confirmations
- **Borders**: ASCII art style lines and corners
- **Interactive Elements**: Text-based with keyboard-style highlighting

## Component Architecture

### 1. Core Design System

#### Typography Scale
```css
- Terminal Header: 24px, bold, letter-spacing: 2px
- Section Title: 18px, bold, letter-spacing: 1px
- Body Text: 14px, normal
- Data Values: 16px, bold (numbers, stats)
- Small Text: 12px (labels, descriptions)
- Tiny Text: 10px (footnotes, timestamps)
```

#### Color System
```css
--terminal-bg: #000000
--terminal-primary: #FFB000 (amber)
--terminal-secondary: #AA7700 (dim amber)
--terminal-success: #00FF66 (bright green)
--terminal-warning: #FFAA00 (orange)
--terminal-error: #FF3300 (red)
--terminal-border: #444444 (gray lines)
--terminal-glow: 0 0 10px currentColor (phosphor effect)
```

#### Layout Patterns
- **Terminal Windows**: Bordered sections with ASCII corners
- **Data Tables**: Monospace aligned columns
- **Command Bars**: Input-style interfaces
- **Status Displays**: Real-time updating text
- **Navigation**: Tab-style but with terminal aesthetics

### 2. Mobile Responsiveness Strategy

#### Breakpoint Philosophy
- **Desktop (1024px+)**: Full terminal interface with multiple panels
- **Tablet (768-1023px)**: Stacked terminal windows
- **Mobile (320-767px)**: Single column terminal with swipeable sections

#### Touch Adaptations
- **Tap Targets**: Minimum 44px for terminal buttons
- **Swipe Navigation**: Horizontal swiping between terminal screens
- **Pull-to-Refresh**: Terminal-style "REFRESHING DATABANK..." message
- **Modal Terminals**: Overlay terminal windows for detailed views

### 3. Component Redesign Strategy

#### Terminal Window Component
```typescript
interface TerminalWindowProps {
  title: string;
  className?: string;
  children: React.ReactNode;
  statusLine?: string;
  isActive?: boolean;
}
```

#### Data Display Patterns
- **Tables**: ASCII-bordered data tables with aligned columns
- **Progress Bars**: Text-based progress indicators `[####....] 40%`
- **Charts**: ASCII art graphs and visualizations
- **Forms**: Command-line style input prompts
- **Buttons**: `[ EXECUTE ]` or `> CONFIRM` style

#### Terminal Effects
- **Typing Animation**: Text appears character by character
- **Scan Lines**: CSS animation overlay
- **Phosphor Glow**: Text-shadow effects
- **Screen Flicker**: Subtle opacity animations
- **Cursor Blink**: Animated terminal cursor

## Implementation Strategy

### Phase 1: Core Terminal Design System (2-3 hours)
1. **Terminal CSS Framework**
   - Core CSS variables and mixins
   - Terminal window base components
   - Typography and color system
   - Basic animations (scan lines, glow)

2. **Base Terminal Components**
   - `TerminalWindow` - Main container component
   - `TerminalHeader` - Title bars with ASCII borders
   - `TerminalText` - Styled text with glow effects
   - `TerminalButton` - Command-style buttons
   - `TerminalInput` - Command line style inputs

### Phase 2: Layout Component Redesign (2-3 hours)
1. **Header Redesign**
   - Terminal-style header with system status
   - Resource displays as terminal readouts
   - ASCII art logo/title

2. **Navigation Redesign**
   - Tab system as terminal screen selection
   - Command-style navigation
   - Status indicators for each section

3. **Main Layout**
   - Terminal window grid system
   - Responsive stacking for mobile
   - Background scan line effects

### Phase 3: Game Component Updates (3-4 hours)
1. **Dashboard**
   - Terminal-style status displays
   - ASCII art ship diagrams
   - Data readouts in terminal format

2. **Mission Command**
   - Command interface aesthetic
   - Data tables with ASCII borders
   - Terminal-style event logs

3. **Ship Builder**
   - Component selection as terminal menus
   - ASCII art ship schematics
   - Technical readout displays

4. **Crew Quarters**
   - Personnel files as terminal records
   - Crew stats in data table format
   - Command interface for crew actions

### Phase 4: Mobile Optimizations (2-3 hours)
1. **Responsive Terminal Windows**
   - Collapsible/expandable sections
   - Single-column mobile layout
   - Touch-friendly terminal controls

2. **Mobile Navigation**
   - Hamburger menu as terminal command list
   - Swipe gestures for screen switching
   - Touch-optimized terminal buttons

### Phase 5: Advanced Terminal Effects (2-3 hours)
1. **Visual Effects**
   - CRT scan line animation
   - Phosphor glow effects
   - Screen flicker simulation
   - Terminal boot sequence

2. **Interactive Elements**
   - Typing animations for text
   - Terminal cursor animations
   - Command execution effects
   - Data streaming animations

## Technical Implementation Details

### CSS Architecture
```css
/* Core terminal variables */
:root {
  --terminal-font: 'Courier New', 'Monaco', monospace;
  --scan-line-height: 2px;
  --glow-intensity: 10px;
  --flicker-opacity: 0.98;
}

/* Terminal window base */
.terminal-window {
  background: var(--terminal-bg);
  border: 2px solid var(--terminal-border);
  color: var(--terminal-primary);
  font-family: var(--terminal-font);
  position: relative;
  overflow: hidden;
}

/* Scan line effect */
.terminal-window::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  animation: scanlines 0.1s linear infinite;
}
```

### Component Pattern Example
```typescript
// TerminalWindow.tsx
export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title,
  children,
  statusLine,
  isActive = true,
  className = ''
}) => {
  return (
    <div className={`terminal-window ${isActive ? 'active' : 'inactive'} ${className}`}>
      <div className="terminal-header">
        <div className="terminal-title-bar">
          ┌─[{title.toUpperCase()}]{'─'.repeat(Math.max(0, 40 - title.length))}┐
        </div>
        {statusLine && (
          <div className="terminal-status">
            │ STATUS: {statusLine.toUpperCase()}
          </div>
        )}
      </div>

      <div className="terminal-content">
        {children}
      </div>

      <div className="terminal-footer">
        └{'─'.repeat(50)}┘
      </div>
    </div>
  );
};
```

### Mobile Responsive Strategy
```css
/* Desktop: Multi-panel terminal */
@media (min-width: 1024px) {
  .terminal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
}

/* Tablet: Stacked terminals */
@media (min-width: 768px) and (max-width: 1023px) {
  .terminal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

/* Mobile: Single column */
@media (max-width: 767px) {
  .terminal-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .terminal-window {
    min-height: 60vh;
  }
}
```

## ASCII Art Integration

### Navigation Elements
```
┌─[STELLAR LEGACY COMMAND INTERFACE]─────────────────┐
│ SYSTEM STATUS: OPERATIONAL                         │
│ COORDINATES: [CLASSIFIED]                          │
├─[NAVIGATION]───────────────────────────────────────┤
│ > DASHBOARD        │ > MISSION COMMAND             │
│ > SHIP BUILDER     │ > DYNASTY HALL                │
│ > CREW QUARTERS    │ > SECT RELATIONS              │
│ > GALAXY MAP       │ > CULTURAL EVOLUTION          │
│ > MARKET           │ > LEGACY                      │
└────────────────────────────────────────────────────┘
```

### Data Tables
```
┌─[SHIP RESOURCES]──┬──[VALUES]──┬──[STATUS]─┐
│ CREDITS           │    50,000  │    [OK]   │
│ ENERGY            │    10,000  │    [OK]   │
│ MINERALS          │     5,000  │   [LOW]   │
│ FOOD              │     8,000  │    [OK]   │
│ INFLUENCE         │     1,000  │   [LOW]   │
└───────────────────┴────────────┴───────────┘
```

### Progress Indicators
```
MISSION PROGRESS: [████████░░] 80% COMPLETE
HULL INTEGRITY:   [██████████] 100% INTACT
CREW MORALE:      [███████░░░] 70% STABLE
```

## Performance Considerations

### Optimization Strategies
1. **CSS-Only Animations**: Use CSS transforms for scan lines and effects
2. **Virtual Scrolling**: For long terminal outputs
3. **Debounced Typing**: Limit typing animation performance impact
4. **Selective Effects**: Disable heavy effects on mobile
5. **Lazy Loading**: Load terminal content progressively

### Accessibility
1. **High Contrast**: Ensure terminal colors meet accessibility standards
2. **Screen Reader**: Provide alt text for ASCII art
3. **Keyboard Navigation**: Full keyboard support for terminal interface
4. **Reduced Motion**: Respect user preferences for animations
5. **Font Scaling**: Support browser zoom and font size preferences

## Success Metrics

### Visual Goals
- [ ] Authentic terminal/retro-futuristic aesthetic
- [ ] Consistent monospace typography throughout
- [ ] Effective use of ASCII art and borders
- [ ] Smooth terminal animations and effects
- [ ] Mobile-responsive terminal interface

### Functional Goals
- [ ] All existing functionality preserved
- [ ] Improved information density
- [ ] Better mobile usability
- [ ] Faster perceived performance
- [ ] Enhanced immersion and theme

### Technical Goals
- [ ] Clean component architecture
- [ ] Performant animations
- [ ] Accessible interface
- [ ] Cross-browser compatibility
- [ ] Mobile-optimized interactions

## Timeline Estimate: 12-15 hours total

This redesign will transform Stellar Legacy into an immersive terminal experience that feels like commanding a starship from a recovered ancient computer system, while maintaining full functionality and mobile compatibility.