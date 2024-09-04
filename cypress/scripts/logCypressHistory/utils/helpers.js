const _ = require('lodash');

const getPipelineData = () => {
  const {
    prData,
    dummyPR,
    BUILD_ID,
    dummyBuildId,
    SOURCE_BRANCH,
  } = require('./constants');

  // Check if all properties are undefined
  const allUndefined = _.every(prData, _.isUndefined);

  // Use either pipeline or dummy data
  const PR_Data = allUndefined ? dummyPR : prData;
  const BuildId = BUILD_ID || dummyBuildId;

  return { prData: PR_Data, BUILD_ID: BuildId, SOURCE_BRANCH };
};

module.exports = {
  getPipelineData,
};
