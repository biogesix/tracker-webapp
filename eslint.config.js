import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    settings: {
      version: "detect",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "client/src/components/ui/**",
      "client/src/hooks/**",
    ],
  },
  { files: ["**/*.{mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "client/tsconfig.json",
            "server/tsconfig.json",
            "client/*.js",
            "server/*.js",
            "eslint.config.js",
          ],
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommended,
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    files: ["client/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
    files: ["client/tailwind.config.js", "client/postcss.config.js"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
    files: ["server/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/consistent-type-assertions": "warn",
    },
  },
];
