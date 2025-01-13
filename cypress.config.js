const axios = require('axios');
const { defineConfig } = require('cypress');

const { RESTORE_SPEC_DATA } = require('./src/graphQL/useMutationCypress');

let globalData = { agreementData: {}, relatedTractData: {} };

module.exports = defineConfig({
	projectId: 'hzhfd6',
	chromeWebSecurity: false,
	video: false,
	videoCompression: 32,
	retries: 2,
	numTestsKeptInMemory: 2,
	experimentalMemoryManagement: true,

	env: {
		// localhost, m1production, m1staging, frontier, m1cypress
		TENENT: 'm1cypress',
	},

	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on('task', {
				setAgreementData: data => {
					globalData = { ...globalData, agreementData: data };
					return null;
				},
				setRelatedTractData: data => {
					globalData = { ...globalData, relatedTractData: data };
					return null;
				},
				getGlobalData: () => {
					return globalData;
				},
			});
		},
		responseTimeout: 60000, // Set the response timeout here
	},

	component: {
		setupNodeEvents(on, config) {
			// Update the cypress log history after execution of each spec
			on('after:spec', async (spec, executionData) => {
				const { UpsertCypressLog } = require('./cypress/scripts/logCypressHistory/upsertCypressLog');
				const { getPipelineData } = require('./cypress/scripts/logCypressHistory/utils/helpers.js');

				const { prData } = getPipelineData();

				const testCases = executionData.tests.map(test => ({
					testcase: test.title[1],
					reason: test.displayError || '',
					isPassed: test.state === 'passed',
					isExecuted: true,
				}));

				const specs = [
					{
						spec: spec.relative,
						testcases: testCases,
					},
				];
				await UpsertCypressLog({ pr: prData, specs: specs });
			});

			// Restore data beforing running each spec
			on('before:spec', async spec => {
				const ldata = require('./cypress/fixtures/ldata.json');
				const { headers } = require('./cypress/cypressUtils/cypressHeaders.js');

				const cypressRestorePayload = {
					operationName: 'restoreSpecData',
					variables: { spec: spec.relative },
					query: RESTORE_SPEC_DATA.loc.source.body,
				};

				let response = await axios({
					method: 'post',
					url: ldata.url,
					data: JSON.stringify(cypressRestorePayload),
					headers: headers,
				});

				if (response.data.data.restoreSpecData) {
					console.log(response.data.data.restoreSpecData.message);
				}
			});
		},
		devServer: {
			framework: 'create-react-app',
			bundler: 'webpack',
		},
		specPattern: 'cypress/component/**/*.cy*',
		responseTimeout: 60000, // Set the response timeout here
	},
});
