import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "@typescript-eslint/eslint-plugin";

const tsFlatConfig = [
  ...tseslint.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  }
];

const config = [
  js.configs.recommended,
  ...tsFlatConfig,
  { ignores: ["dist/", "node_modules/", "worker/", "supabase/"] }
];

export default config;
