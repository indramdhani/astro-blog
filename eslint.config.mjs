import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
	{ ignores: ["dist/", "node_modules/", ".astro/"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	...astro.configs["jsx-a11y-recommended"],
	prettier,
	{
		languageOptions: { globals: { ...globals.node, ...globals.browser } },
		rules: {
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-non-null-assertion": "off",
		},
	},
	{
		files: ["**/*.cjs", "*.config.js", ".prettierrc.js"],
		rules: { "@typescript-eslint/no-require-imports": "off" },
	},
	{
		files: ["src/env.d.ts"],
		rules: { "@typescript-eslint/triple-slash-reference": "off" },
	}
);
