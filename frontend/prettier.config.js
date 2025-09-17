/** @type {import("prettier").Config} */
export default {
  // Basic formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // JSX specific
  jsxSingleQuote: false,

  // Trailing commas
  trailingComma: 'es5',

  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // Range formatting
  rangeStart: 0,
  rangeEnd: Infinity,

  // Parser options
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Vue files (not applicable but good to have)
  vueIndentScriptAndStyle: false,

  // End of line
  endOfLine: 'lf',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in JSX
  singleAttributePerLine: false,

  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 100,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
