import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

const { npm_lifecycle_event } = process.env;
const strictMode =
	npm_lifecycle_event.includes('lint') || npm_lifecycle_event.includes('build');

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	perfectionist.configs['recommended-natural'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'curly': 'error',
			'no-console': [strictMode ? 'warn' : 'off', { allow: ['error', 'info'] }],
			'no-debugger': strictMode ? 'warn' : 'off',
			'no-irregular-whitespace': 'off',
			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '*.min.*']
	}
);
