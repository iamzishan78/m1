const presetReact = require('@babel/preset-react').default;
const presetCRA = require('babel-preset-react-app');
const CracoEsbuildPlugin = require('craco-esbuild');
const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
	babel: {
		loaderOptions: babelLoaderOptions => {
			const origBabelPresetReactAppIndex = babelLoaderOptions.presets.findIndex(preset =>
				preset[0].includes('babel-preset-react-app')
			);

			if (origBabelPresetReactAppIndex !== -1) {
				const overridenBabelPresetReactApp = (...args) => {
					const babelPresetReactAppResult = presetCRA(...args);
					const origPresetReact = babelPresetReactAppResult.presets.find(preset => preset[0] === presetReact);
					Object.assign(origPresetReact[1], {
						importSource: '@welldone-software/why-did-you-render',
					});
					return babelPresetReactAppResult;
				};
				babelLoaderOptions.presets[origBabelPresetReactAppIndex] = overridenBabelPresetReactApp;
			}
			return babelLoaderOptions;
		},
	},
	eslint: {
		enable: false,
	},
	webpack: {
		configure: webpackConfig => {
			webpackConfig.entry = process.env.CYPRESS === 'true' ? './src/cypress.js' : './src/index.js';
			webpackConfig.resolve = {
				...webpackConfig.resolve,
				alias: {
					...webpackConfig.resolve.alias,
					'mapbox-gl': path.resolve('node_modules/mapbox-gl/dist/mapbox-gl.js'),
				},
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				mainFields: ['browser', 'module', 'main'],
			};

			// Ensure Babel processes mapbox-gl
			const babelLoader = webpackConfig.module.rules
				.find(rule => rule.oneOf && Array.isArray(rule.oneOf))
				.oneOf.find(rule => rule.loader && rule.loader.includes('babel-loader'));

			babelLoader.include = [...(babelLoader.include || []), path.resolve('node_modules/mapbox-gl')];

			return webpackConfig;
		},
		plugins: [
			new ProvidePlugin({
				React: 'react',
				Buffer: ['buffer', 'Buffer'],
				process: 'process/browser',
			}),
		],
	},
	plugins: [
		{
			plugin: CracoEsbuildPlugin,
			options: {
				esbuildLoaderOptions: {
					loader: 'jsx',
					target: 'es2018',
				},
				esbuildMinimizerOptions: {
					target: 'es2018',
					css: true,
				},
				skipEsbuildJest: true,
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
