module.exports = {
	webpack: {
		configure: webpackConfig => {
			// Add a Babel loader to handle optional chaining and other modern JavaScript features
			webpackConfig.module.rules.push({
				test: /\.(js|jsx|mjs|cjs|ts|tsx)$/, // Include JS/TS files
				exclude: /node_modules/, // Exclude node_modules
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
						plugins: [
							['@babel/plugin-proposal-class-properties', { loose: true }], // Add class fields support
							['@babel/plugin-proposal-private-methods', { loose: true }], // Add private methods support
							['@babel/plugin-proposal-private-property-in-object', { loose: true }], // Add private properties in objects
							'@babel/plugin-proposal-optional-chaining',
							'@babel/plugin-proposal-nullish-coalescing-operator',
							'@babel/plugin-proposal-logical-assignment-operators',
						],
					},
				},
			});
			return webpackConfig;
		},
	},
	babel: {
		// Ensure optional chaining is supported
		plugins: [
			['@babel/plugin-proposal-class-properties', { loose: true }], // Add class fields support
			['@babel/plugin-proposal-private-methods', { loose: true }], // Add private methods support
			['@babel/plugin-proposal-private-property-in-object', { loose: true }], // Add private properties in objects
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-nullish-coalescing-operator',
			'@babel/plugin-proposal-logical-assignment-operators',
		],
	},
	eslint: {
		enable: false,
		mode: 'extends',
		configure: {
			rules: {
				// Example: disable prop-types rule for Material-UI
				'react/prop-types': 'off',
			},
		},
	},
	// style: {
	//  postcss: {
	//      plugins: [
	//          require('tailwindcss'),
	//          require('autoprefixer'),
	//      ],
	//  },
	// },
	resolve: {
		alias: {
			// Ensure Material-UI styled-engine works correctly with styled-components if needed
			'@mui/styled-engine': '@mui/styled-engine-sc',
		},
	},
};
