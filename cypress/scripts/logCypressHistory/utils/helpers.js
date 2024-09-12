const _ = require('lodash');

const getPipelineData = () => {
  const {
    dummyPR,
    BUILD_ID,
    dummyBuildId,
    SOURCE_BRANCH,
    PIPELINE_RUN_MODE,
    PIPELINE_TRIGGER_MODE,
  } = require('./constants');

  // Parse the JSON string of env back into an object
  const pullRequestData = JSON.parse(process.env.pullRequestData || '{}');

  // Check if all properties are undefined
  const allUndefined = _.every(pullRequestData, _.isUndefined);

  // Use either pipeline or dummy data
  const PR_Data = allUndefined ? dummyPR : pullRequestData;
  const BuildId = BUILD_ID || dummyBuildId;

  return { prData: PR_Data, BUILD_ID: BuildId, PIPELINE_TRIGGER_MODE, PIPELINE_RUN_MODE, SOURCE_BRANCH, };
};

module.exports = {
  getPipelineData,
};
