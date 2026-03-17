import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  // Base Next.js config per docs
  nextPlugin.configs["core-web-vitals"],
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}", "*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        File: "readonly",
        Blob: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        React: "readonly",
        process: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "unused-imports": unusedImports,
      import: importPlugin,
      prettier: prettier,
      react: react,
      "react-hooks": reactHooks,
    },
    rules: {
      // Prettier
      "prettier/prettier": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",

      // React
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "warn",

      // React Hooks
      "react-hooks/exhaustive-deps": "warn",

      // Next.js (somente regras existentes)
      "@next/next/no-img-element": "warn",

      // Imports
      "import/order": "off",

      // Unused imports
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Gerais
      "no-console": "warn",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
      "no-empty-pattern": "off",
      "no-constant-binary-expression": "warn",
      "no-extra-boolean-cast": "warn",
      "no-prototype-builtins": "off",
    },
  },
  // List of ignore patterns using Flat config helper
  globalIgnores([
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "build/",
    ".env*",
    "*.log",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "*.tsbuildinfo",
    ".vscode/",
    ".idea/",
    ".DS_Store",
    "Thumbs.db",
    "public/",
    "*.config.js",
    "*.config.ts",
    "next.config.js",
    "postcss.config.js",
    "tailwind.config.js",
    "next-env.d.ts",
  ]),
  prettierConfig,
]);
