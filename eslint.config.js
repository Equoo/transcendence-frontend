import js from "@eslint/js";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", ".react-router/*"]),
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
			"sort-keys": "off",
			"max-lines-per-function": "off",
			"one-var": "off",
			"func-style": "off",
			"no-ternary": "off",
			"no-nested-ternary": "off",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
		},
	},
]);
