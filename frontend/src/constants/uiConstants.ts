// constants/uiConstants.ts - Terminal UI Design System per Terminal_UI_Redesign_Plan.md
export const uiConstants = {
  NAVIGATION: {
    CORE_SYSTEMS_HEADER_LENGTH: 15,
    GENERATIONAL_SYSTEMS_HEADER_LENGTH: 23,
    CORE_TABS_WIDTH: 50,
    GENERATIONAL_TABS_WIDTH: 60,
    TAB_LABEL_PADDING: {
      CORE: 15,
      GENERATIONAL: 20,
    },
  },
  SHIP_STATUS: {
    ICON_SIZE: 'w-32 h-32',
    ICON_BG: 'bg-black', // Terminal black background
    STAT_ITEM_BG: 'bg-black', // Terminal black background
    GRID_COLUMNS: 2,
    GRID_GAP: 4,
  },
  SPACING: {
    CARD_PADDING: 'p-6',
    CARD_PADDING_SM: 'p-3',
    CARD_PADDING_LG: 'p-8',
    GRID_GAP: 'gap-4',
    GRID_GAP_SM: 'gap-2',
    GRID_GAP_LG: 'gap-6',
    SECTION_MARGIN: 'mb-6',
    SECTION_MARGIN_SM: 'mb-4',
    SECTION_MARGIN_LG: 'mb-8',
  },
  COLORS: {
    // Terminal phosphor colors - exact match to design plan CSS variables
    TEXT_PRIMARY: 'terminal-text', // --terminal-primary: #FFB000
    TEXT_SECONDARY: 'terminal-text dim', // --terminal-secondary: #AA7700
    TEXT_MUTED: 'text-gray-600', // --terminal-text-dim: #666666
    TEXT_SUCCESS: 'terminal-text success', // --terminal-success: #00FF66
    TEXT_WARNING: 'terminal-text warning', // --terminal-warning: #FFAA00
    TEXT_ERROR: 'terminal-text error', // --terminal-error: #FF3300
    BORDER: 'border-gray-600', // --terminal-border: #444444
    BORDER_LIGHT: 'border-gray-500',
    BORDER_DARK: 'border-gray-700',
    BG_PRIMARY: 'bg-black', // --terminal-bg: #000000
    BG_SECONDARY: 'bg-black', // Terminal secondary should also be pure black
    BG_TERTIARY: 'bg-black', // Keep consistent with terminal aesthetic
    BG_SUCCESS: 'bg-black', // Terminal uses black bg with colored text/borders
    BG_WARNING: 'bg-black', // Terminal uses black bg with colored text/borders
    BG_ERROR: 'bg-black', // Terminal uses black bg with colored text/borders
    HOVER_TEXT_PRIMARY: 'hover:text-amber-300',
    HOVER_TEXT_MUTED: 'hover:text-gray-400',
    HOVER_BG_SECONDARY: 'hover:bg-black', // Keep pure black for terminal consistency
    HOVER_BG_TERTIARY: 'hover:bg-black', // Use amber glow effects instead of gray backgrounds
  },
  BUTTONS: {
    BASE_CLASSES: 'terminal-button', // Use terminal button class from terminal.css
    SIZE: {
      SM: 'px-3 py-1 text-sm',
      MD: 'px-4 py-2',
      LG: 'px-6 py-3 text-lg',
    },
    VARIANT: {
      PRIMARY: 'terminal-button primary',
      SECONDARY: 'terminal-button',
      DANGER: 'terminal-button error',
    },
    DISABLED: 'opacity-50 cursor-not-allowed',
  },
  CARDS: {
    BASE: 'terminal-window', // Use terminal window class from terminal.css
    BACKGROUND: 'terminal-window', // Terminal window includes background
    BORDER: 'border border-gray-600', // Gray terminal borders
    HEADER: 'terminal-header terminal-text', // Terminal header styling
  },
  NOTIFICATIONS: {
    BASE: 'border p-4 mb-4 font-mono',
    SUCCESS: 'bg-black border-green-600 text-green-400', // Terminal green on black
    WARNING: 'bg-black border-orange-600 text-orange-400', // Terminal orange on black
    ERROR: 'bg-black border-red-600 text-red-400', // Terminal red on black
    INFO: 'bg-black border-gray-600 text-amber-400', // Terminal amber on black
  },

  // Terminal-specific styling
  TERMINAL: {
    FONT: 'font-mono tracking-wide',
    GLOW: 'drop-shadow-sm', // Subtle phosphor glow effect
    HEADER_STYLE: 'text-center tracking-widest uppercase',
    DATA_TABLE: 'font-mono text-sm leading-relaxed',
    ASCII_BORDER: 'border-gray-600 border-2',
  },
} as const;
