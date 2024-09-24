import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a compatibility layer for extending ESLint configurations
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	// Configuration to ignore specific file patterns and directories
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
	
	// Extend configurations from recommended ESLint setups
	...compat.extends('plugin:react/recommended', 'airbnb', 'prettier'),
	{
		// Define plugins used in the configuration
		plugins: {
			react,
			import: importPlugin,
		},
		
		// Define language options
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		
		// Custom rules for the project
		rules: {
			'no-underscore-dangle': 'off',        // Allow underscores in variable names
			'no-plusplus': 'off',                // Allow ++ and -- operators
			camelcase: 'off',                   // Allow non-camelcase variable names
			'react-hooks/exhaustive-deps': 'off', // Disable exhaustive-deps rule for React hooks
			'import/no-named-as-default-member': 'off', // Allow named exports as default
			'import/no-mutable-exports': 'off',  // Allow mutable exports
			'no-unsafe-optional-chaining': 'error', // unsafe optional chaining
		},
	},
];
