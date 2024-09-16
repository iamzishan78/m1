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
    console.log("Pipeline trigger mode: ", PIPELINE_TRIGGER_MODE)
    console.log("Pipeline run mode: ", PIPELINE_RUN_MODE);
    console.log("Ppr data: ", prData);
    


    const resetPipelinePayload = {
      operationName: 'resetPipeline',
      variables: {
        log: {
          pr: prData,
          isUpdateReset: isUpdateReset,
          sourceBranch: SOURCE_BRANCH,
          pipelineRunMode: PIPELINE_RUN_MODE,
          pipelineTriggerMode: PIPELINE_TRIGGER_MODE,
        },
      },
      query: RESET_PIPELINE.loc.source.body,
    };

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
