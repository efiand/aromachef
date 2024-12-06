import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

const scriptName = process?.env?.npm_lifecycle_event || '';
const strictMode = scriptName.includes('lint') || scriptName.includes('build');

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
