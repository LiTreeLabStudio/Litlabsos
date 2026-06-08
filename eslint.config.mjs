import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "debug_auth.js",
  ]),
  {
    rules: {
      // Downgrade to warnings — these are non-breaking patterns
      "react-hooks/set-state-in-effect": "warn",
      "prefer-const": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
]);

export default eslintConfig;
