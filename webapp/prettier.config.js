const config = {
  semi: true, // Add semicolons at the end of statements
  singleQuote: false, // Use single quotes instead of double quotes
  jsxSingleQuote: false, // Use double quotes in JSX
  trailingComma: "es5", // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  printWidth: 80, // Wrap lines at 80 characters
  tabWidth: 2, // Use 2 spaces per tab
  useTabs: false, // Use spaces instead of tabs
  bracketSpacing: true, // Add spaces between brackets in object literals
  arrowParens: "always", // Always include parentheses around arrow function parameters
  endOfLine: "lf", // Use Unix line endings
  proseWrap: "preserve", // Don't change wrapping in Markdown files
  overrides: [
    {
      files: ["*.json", "*.yml", "*.yaml"],
      options: { printWidth: 120, tabWidth: 2 },
    },
  ],
};

export default config;
