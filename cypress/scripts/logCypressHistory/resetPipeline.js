const axios = require('axios');
const {
  RESET_PIPELINE,
} = require('../../../src/graphQL/useMutationCypress.js');
const { getPipelineData } = require('./utils/helpers.js');
const { SOURCE_BRANCH, PIPELINE_TRIGGER_MODE, PIPELINE_RUN_MODE, prData } =
  getPipelineData();

const ResetPipeline = async ({ isUpdateReset }) => {
  try {
    const ldata = require('../../fixtures/ldata.json');
    const { headers } = require('../../cypressUtils/cypressHeaders.js');

    const resetPipelinePayload = {
      operationName: 'resetPipeline',
      variables: {
        log: {
          pr: prData,
          isUpdateReset: isUpdateReset,
          sourceBranch: SOURCE_BRANCH?.trim(),
          pipelineRunMode: PIPELINE_RUN_MODE?.trim(),
          pipelineTriggerMode: PIPELINE_TRIGGER_MODE?.trim(),
        },
      },
      query: RESET_PIPELINE.loc.source.body,
    };

    console.log(JSON.stringify(resetPipelinePayload))
    
    let response = await axios({
      method: 'post',
      url: ldata.url,
      data: JSON.stringify(resetPipelinePayload),
      headers: headers,
    });

    if (
      response &&
      response.data &&
      response.data.data &&
      response.data.data.resetPipeline
    ) {
      response = response.data.data.resetPipeline;
      console.log("resetPipeline responnse: ", response)
      return response;
    } else {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    throw new Error(`Error reseting pipelinne: ${error.message}`);
  }
};

module.exports = { ResetPipeline };
