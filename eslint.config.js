import js from "@eslint/js";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", ".react-router/*", "node_modules"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.all,
			tseslint.configs.all,
			reactRefresh.configs.vite,
			eslintReact.configs["all"],
		],
		languageOptions: {
			globals: globals.browser,
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// Stylistic rules from the "all" presets we don't want
			"react-refresh/only-export-components": "off",
			"sort-imports": "off", // handled by simple-import-sort
			"sort-keys": "off",
			"capitalized-comments": "off",
			"no-void": "off",
			"max-statements": "off",
			"max-lines-per-function": "off",
			"one-var": "off",
			"func-style": "off",
			"no-ternary": "off",
			"no-nested-ternary": "off",
			"no-bitwise": "off",
			"no-console": ["error", { allow: ["warn", "error"] }],

			// TypeScript
			"@typescript-eslint/prefer-literal-enum-member": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-unsafe-type-assertion": "off",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@typescript-eslint/strict-boolean-expressions": "off",

			// @eslint-react
			"@eslint-react/jsx-no-children-prop": "off",
			"@eslint-react/exhaustive-deps": "off",

			// Imports
			"simple-import-sort/imports": "warn",
			"simple-import-sort/exports": "warn",

			// Unused code: unused-imports replaces both base and TS rules
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],

			// Core hooks rules
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			// React Compiler rules
			"react-hooks/config": "error",
			"react-hooks/error-boundaries": "error",
			"react-hooks/gating": "error",
			"react-hooks/globals": "error",
			"react-hooks/immutability": "error",
			"react-hooks/preserve-manual-memoization": "error",
			"react-hooks/purity": "error",
			"react-hooks/refs": "error",
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/set-state-in-render": "error",
			"react-hooks/static-components": "error",
			"react-hooks/unsupported-syntax": "warn",
			"react-hooks/use-memo": "error",
			"react-hooks/incompatible-library": "warn",
		},
		plugins: {
			"simple-import-sort": simpleImportSort,
			"unused-imports": unusedImports,
			"react-hooks": reactHooks,
		},
	},
]);
