import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";

/* The point of this config is narrow and deliberate: catch the mistakes that
   reach a deploy and break the app at runtime, without flooding the output
   with style opinions nobody asked for.

   It exists because `EXAM is not defined` shipped. Rollup bundles an unknown
   identifier without complaint — it only fails in the browser, and only on the
   code path that references it, which in that case was a line that renders for
   people who had sat an exam and nobody else. `no-undef` catches that class of
   bug in the editor, before it is ever built. */
export default [
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": reactHooks, react },
    settings: { react: { version: "detect" } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      /* without these, every component and icon used only inside JSX reads as
         an unused import, which buries the warnings that matter */
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",

      /* the ones that actually break a page at runtime */
      "no-undef": "error",
      "no-unsafe-optional-chaining": "error",
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-dupe-class-members": "error",

      /* an identifier left behind by a refactor is how this started, so an
         unused import is worth seeing — but not worth failing a build over */
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

      /* noise in a codebase that uses neither */
      "no-empty": ["error", { allowEmptyCatch: true }],
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    /* the canvas film scripts and node-side scratch tooling */
    files: ["*.config.js", "scripts/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
