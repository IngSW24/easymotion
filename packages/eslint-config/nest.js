import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: [".eslintrc.js"] },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
      ecmaVersion: 2020,
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier,
    },

    configs: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier.configs.recommended,
    ],

    files: ["**/*.{ts,tsx}"],

    // 🔹 Rules (Equivalent to your old config)
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
    },
  }
);
