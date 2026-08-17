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
			"react-refresh/only-export-components": "off",
			"sort-imports": "off",
			"sort-keys": "off",
			"no-void": "off",
			"max-statements": "off",
			"max-lines-per-function": "off",
			"one-var": "off",
			"func-style": "off",
			"no-ternary": "off",
			"no-nested-ternary": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-type-assertion": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@eslint-react/exhaustive-deps": "off",
			"@eslint-react/jsx-no-children-prop": "off",
			"no-console": ["error", { allow: ["warn", "error"] }],
			"@typescript-eslint/strict-boolean-expressions": "off",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"unused-imports/no-unused-imports": "error",

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
			"react-hooks/set-state-in-effect": "error",
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
