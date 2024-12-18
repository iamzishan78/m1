const _ = require('lodash');

const getPipelineData = () => {
	const {
		dummyPR,
		BUILD_ID,
		dummyBuildId,
		SOURCE_BRANCH,
		PIPELINE_RUN_MODE,
		PIPELINE_TRIGGER_MODE,
		defaultPipelineRunMode,
		defaultPipelineTriggerMode,
	} = require('./constants');

	// Parse the JSON string of env back into an object
	const pullRequestData = JSON.parse(process.env.pullRequestData || '{}');

	// Check if all properties are undefined
	const allUndefined = _.every(pullRequestData, _.isUndefined);

	// Use either pipeline or dummy data
	const PR_Data = allUndefined ? dummyPR : pullRequestData;
	const BuildId = BUILD_ID || dummyBuildId;
	const pipelineRunMode = PIPELINE_RUN_MODE || defaultPipelineRunMode;
	const pipelineTriggerMode = PIPELINE_TRIGGER_MODE || defaultPipelineTriggerMode;

	return {
		prData: PR_Data,
		BUILD_ID: BuildId,
		PIPELINE_TRIGGER_MODE: pipelineTriggerMode,
		PIPELINE_RUN_MODE: pipelineRunMode,
		SOURCE_BRANCH,
	};
};

module.exports = {
	getPipelineData,
};
