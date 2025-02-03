const presetReact = require('@babel/preset-react').default;
const presetCRA = require('babel-preset-react-app');
const CracoEsbuildPlugin = require('craco-esbuild');
const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
	babel: {
		loaderOptions: babelLoaderOptions => {
			const origBabelPresetReactAppIndex = babelLoaderOptions.presets.findIndex(preset => {
				return preset[0].includes('babel-preset-react-app');
			});

			if (origBabelPresetReactAppIndex === -1) {
				return babelLoaderOptions;
			}

			const overridenBabelPresetReactApp = (...args) => {
				const babelPresetReactAppResult = presetCRA(...args);
				const origPresetReact = babelPresetReactAppResult.presets.find(preset => {
					return preset[0] === presetReact;
				});
				Object.assign(origPresetReact[1], {
					importSource: '@welldone-software/why-did-you-render',
				});
				return babelPresetReactAppResult;
			};

			babelLoaderOptions.presets[origBabelPresetReactAppIndex] = overridenBabelPresetReactApp;

			return babelLoaderOptions;
		},
	},
	eslint: {
		enable: false,
	},
	webpack: {
		configure: webpackConfig => {
			webpackConfig.entry = process.env.CYPRESS === 'true' ? './src/cypress.js' : './src/index.js';
			// Add Babel loader for specific modules
			webpackConfig.module.rules.push({
				test: /\.js$/,
				include: [
					path.resolve('node_modules/@mui/x-date-pickers'),
					path.resolve('node_modules/@tanstack/virtual-core'),
					path.resolve('node_modules/@mui/utils'),
					path.resolve('node_modules/polyclip-ts'),
					path.resolve('node_modules/splaytree-ts'),
					path.resolve('node_modules/@deck.gl'),
					path.resolve('node_modules/@math.gl'),
					path.resolve('node_modules/@probe.gl'),
					path.resolve('node_modules/mjolnir.js'),
					path.resolve('node_modules/@loaders.gl'),
					path.resolve('node_modules/@luma.gl/core'),
					path.resolve('node_modules/@luma.gl'),
					path.resolve('node_modules/@nebula.gl/layers'),
				],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							'@babel/plugin-proposal-optional-chaining',
							'@babel/plugin-proposal-nullish-coalescing-operator',
							'@babel/plugin-proposal-logical-assignment-operators',
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-private-methods',
						],
					},
				},
			});

			return webpackConfig;
		},

		plugins: [
			new ProvidePlugin({
				React: 'react',
			}),
		],
	},
	plugins: [
		{
			plugin: CracoEsbuildPlugin,
			options: {
				esbuildLoaderOptions: {
					// Optional. Defaults to auto-detect loader.
					loader: 'jsx', // Set the value to 'tsx' if you use typescript
					target: 'es2018',
				},
				esbuildMinimizerOptions: {
					// Optional. Defaults to:
					target: 'es2018',
					css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
				},
				skipEsbuildJest: true, // Optional. Set to true if you want to use babel for jest tests,
				esbuildJestOptions: {
					loaders: {
						'.ts': 'ts',
						'.tsx': 'tsx',
					},
				},
			},
		},
	],
};
