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
			'no-underscore-dangle': 'off', // Allow underscores in variable names
			// 'no-plusplus': 'off', // Allow ++ and -- operators
			'global-require': 'off', // Allow require() statements anywhere
			camelcase: 'off', // Allow non-camelcase variable names
			// 'no-return-await': 'off', // Allow return of await expressions
			// 'no-await-in-loop': 'off', // Allow await expressions inside loopsfre
			// 'no-promise-executor-return': 'off', // Allow return statements in promise constructors

			// Disallow unsafe optional chaining.
    		// Risk: Unsafe optional chaining can lead to runtime errors and unexpected behaviors if not used carefully.
			'no-unsafe-optional-chaining': 'error', //  unsafe optional chaining
		
			// Disallow `await` inside of loops to prevent sequential execution of asynchronous calls.
			// Risk: Using `await` in a loop can lead to performance issues.
			"no-await-in-loop": "error",

			// Disallow throwing literals as exceptions.
			// Risk: Throwing literals can lead to uncaught exceptions that are difficult to debug.
			"no-throw-literal": "error",

			// Disallow duplicate imports from the same module.
			// Risk: Duplicate imports can create confusion and lead to larger bundle sizes.
			"no-duplicate-imports": "error",

			// Disallow variable and function declarations in inner blocks.
			// Risk: Inner declarations can lead to unexpected scoping issues.
			"no-inner-declarations": "error",

			// Require `return` statements to either always or never specify values.
			// Risk: Inconsistent return behavior can lead to bugs.
			"consistent-return": "error",

			// Enforce consistent brace style for all control statements.
			// Risk: Inconsistent brace styles can lead to misunderstandings about block scope.
			"curly": "error",

			// Disallow unused variables.
			// Risk: Unused variables clutter the code and can indicate logical errors.
			"no-unused-vars": "error",

			// Disallow the use of undeclared variables.
			// Risk: Using undeclared variables can lead to runtime errors.
			"no-undef": "error",

			// Disallow the use of variables before they are defined.
			// Risk: This can lead to unexpected behavior and runtime errors.
			"no-use-before-define": "error",

			// Require error handling in callbacks.
			// Risk: Ignoring errors can lead to unhandled exceptions.
			"handle-callback-err": "error",

			// Enforce the consistent use of either backticks, double, or single quotes.
			// Risk: Inconsistent quote usage can lead to confusion.
			"quotes": ["error", "single"], // Example: enforcing single quotes

			// Disallow reassigning class members.
			// Risk: Reassigning class members can lead to unexpected behavior.
			"no-class-assign": "error",

			// Prefer arrow functions as callbacks.
			// Risk: Using regular functions can lead to issues with `this` binding.
			"prefer-arrow-callback": "error",

			// Disallow `new` expressions outside of assignments or comparisons.
			// Risk: Using `new` without assignment can lead to ignored instances.
			"no-new": "error",

			// Disallow the use of `eval()`.
			// Risk: Using `eval()` can lead to security vulnerabilities.
			"no-eval": "error",

			// Enforce typechecking with PropTypes in React components.
			// Risk: Not using PropTypes can lead to runtime errors.
			"react/prop-types": "error",

			// Prevent using array indices as keys in React lists.
			// Risk: Using array indices can lead to issues with component state.
			"react/no-array-index-key": "error",

            // Add no-magic-numbers rule
            'no-magic-numbers/no-magic-numbers': ['error', {
                ignore: [0, 1], // Allow these numbers if needed
            }],

		},
	},
];
