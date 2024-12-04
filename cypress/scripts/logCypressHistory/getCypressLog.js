const axios = require('axios');
const { GET_CYPRESS_LOG } = require('../../../src/graphQL/useQueryCypressLog.js');

const GetCypressLog = async () => {
	try {
		const { getPipelineData } = require('./utils/helpers.js');
		const { prData, SOURCE_BRANCH } = getPipelineData();

		const ldata = require('../../fixtures/ldata.json');
		const { headers } = require('../../cypressUtils/cypressHeaders.js');

		const getCypressLogPayload = {
			operationName: 'getCypressLog',
			variables: {
				prId: prData.pullRequestId,
				sourceBranch: SOURCE_BRANCH,
			},
			query: GET_CYPRESS_LOG.loc.source.body,
		};

		let response = await axios({
			method: 'post',
			url: ldata.url,
			data: JSON.stringify(getCypressLogPayload),
			headers: headers,
		});

		if (response && response.data && response.data.data && response.data.data.getCypressLog) {
			response = response.data.data.getCypressLog;
			return response;
		} else {
			throw new Error('Invalid response structure');
		}
	} catch (error) {
		throw new Error(`Error getting cypress log: ${error.message}`);
	}
};

module.exports = { GetCypressLog };
