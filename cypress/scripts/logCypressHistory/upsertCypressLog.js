const axios = require('axios');
const { UPSERT_CYPRESS_LOG } = require('../../../src/graphQL/useMutationCypress.js');
const { BUILD_ID, SOURCE_BRANCH } = require('./utils/constants.js');

const UpsertCypressLog = async ({ pr, specs, buildId = BUILD_ID, isFailedRetry = false}) => {
  try {
    const ldata = require('../../fixtures/ldata.json');
    const { headers } = require('../../cypressUtils/cypressHeaders.js');

    const upsertCypressLogPayload = {
      operationName: 'upsertCypressLog',
      variables: {
        log: {
          pr: pr,
          specs: specs,
          sourceBranch: SOURCE_BRANCH,
          buildId: buildId,
          isFailedRetry: isFailedRetry,
        },
      },
      query: UPSERT_CYPRESS_LOG.loc.source.body,
    };

    let response = await axios({
      method: 'post',
      url: ldata.url,
      data: JSON.stringify(upsertCypressLogPayload),
      headers: headers,
    });

    if (response && response.data && response.data.data && response.data.data.upsertCypressLog) {
        response = response.data.data.upsertCypressLog;
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure');
      }
  } catch (error) {
    throw new Error(`Error logging test case: ${error.message}`);
  }
};

module.exports = { UpsertCypressLog };
