import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: [
			'**/node_modules/*',
			'**/node_modules/',
			'!.*.js',
			'**/*.min.js',
			'**/.*cache',
			'**/.next/',
			'**/build/',
			'**/dist/',
			'**/docs/',
			'**/public/',
			'**/svgIcons/',
		],
	},
	...compat.extends('plugin:react/recommended', 'airbnb', 'prettier'),
	{
		plugins: {
			react,
			import: importPlugin,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'no-underscore-dangle': 'off',
			'no-plusplus': 'off',
			camelcase: 'off',
			'react-hooks/exhaustive-deps': 'off',
			'import/no-named-as-default-member': 'off',
			'import/no-mutable-exports': 'off',
		},
	},
];
