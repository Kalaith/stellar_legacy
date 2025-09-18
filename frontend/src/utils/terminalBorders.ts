// utils/terminalBorders.ts - Dynamic ASCII border generation for terminal UI

/**
 * Generates dynamic ASCII borders that adjust to content width
 * @param title - The title text to display in the border
 * @param minWidth - Minimum width for the border (default: 60)
 * @param padding - Extra padding around the title (default: 10)
 * @returns Object with top and bottom border strings
 */
export const generateTerminalBorder = (
  title: string,
  minWidth: number = 60,
  padding: number = 10
) => {
  const titleLength = title.length;
  const borderWidth = Math.max(minWidth, titleLength + padding);

  // Calculate the actual total width including all characters
  const topLength = 4 + titleLength; // "┌─[" + title + "]" = 4 + title length
  const remainingDashes = Math.max(0, borderWidth - topLength - 1); // -1 for final "┐"

  const actualTotalWidth = topLength + remainingDashes + 1; // +1 for final "┐"

  return {
    top: `┌─[${title}]${'─'.repeat(remainingDashes)}┐`,
    bottom: `└${'─'.repeat(actualTotalWidth - 2)}┘` // -2 for "└" and "┘"
  };
};

/**
 * Generates a simple horizontal line border
 * @param width - Width of the border
 * @returns Horizontal line string
 */
export const generateHorizontalBorder = (width: number = 60) => {
  return '─'.repeat(width);
};

/**
 * Generates a box border around content
 * @param title - Title for the box
 * @param width - Width of the box
 * @returns Object with all border parts
 */
export const generateBoxBorder = (title?: string, width: number = 60) => {
  if (title) {
    return generateTerminalBorder(title, width);
  }

  return {
    top: `┌${'─'.repeat(width - 2)}┐`,
    middle: `│${' '.repeat(width - 2)}│`,
    bottom: `└${'─'.repeat(width - 2)}┘`
  };
};