// constants/uiConstants.ts
export const UI_CONSTANTS = {
  NAVIGATION: {
    CORE_SYSTEMS_HEADER_LENGTH: 15,
    GENERATIONAL_SYSTEMS_HEADER_LENGTH: 23,
    CORE_TABS_WIDTH: 50,
    GENERATIONAL_TABS_WIDTH: 60,
    TAB_LABEL_PADDING: {
      CORE: 15,
      GENERATIONAL: 20
    }
  },
  SHIP_STATUS: {
    ICON_SIZE: 'w-32 h-32',
    ICON_BG: 'bg-slate-700',
    STAT_ITEM_BG: 'bg-slate-700',
    GRID_COLUMNS: 2,
    GRID_GAP: 4
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
    SECTION_MARGIN_LG: 'mb-8'
  },
  COLORS: {
    TEXT_PRIMARY: 'text-white',
    TEXT_SECONDARY: 'text-slate-300',
    TEXT_MUTED: 'text-slate-400',
    TEXT_SUCCESS: 'text-green-400',
    TEXT_WARNING: 'text-yellow-400',
    TEXT_ERROR: 'text-red-400',
    BORDER: 'border-slate-700',
    BORDER_LIGHT: 'border-slate-600',
    BORDER_DARK: 'border-slate-800',
    BG_PRIMARY: 'bg-slate-800',
    BG_SECONDARY: 'bg-slate-700',
    BG_TERTIARY: 'bg-slate-600',
    BG_SUCCESS: 'bg-green-600',
    BG_WARNING: 'bg-yellow-600',
    BG_ERROR: 'bg-red-600'
  },
  BUTTONS: {
    BASE_CLASSES: 'font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800',
    SIZE: {
      SM: 'px-3 py-1 text-sm',
      MD: 'px-4 py-2',
      LG: 'px-6 py-3 text-lg'
    },
    VARIANT: {
      PRIMARY: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
      SECONDARY: 'bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500',
      DANGER: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    },
    DISABLED: 'opacity-50 cursor-not-allowed'
  },
  CARDS: {
    BASE: 'rounded-lg',
    BACKGROUND: 'bg-slate-800',
    BORDER: 'border border-slate-700',
    HEADER: 'text-lg font-bold text-white px-6 py-4 border-b border-slate-700'
  },
  NOTIFICATIONS: {
    BASE: 'rounded-lg border p-4 mb-4',
    SUCCESS: 'bg-green-900 border-green-600 text-green-100',
    WARNING: 'bg-yellow-900 border-yellow-600 text-yellow-100',
    ERROR: 'bg-red-900 border-red-600 text-red-100',
    INFO: 'bg-blue-900 border-blue-600 text-blue-100'
  }
} as const;