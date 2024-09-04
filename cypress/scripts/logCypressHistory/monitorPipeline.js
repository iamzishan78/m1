// monitor.js
const { triggerAzurePipeline } = require('./triggerAzurePipeline.js');
const { UpsertCypressLog } = require('./upsertCypressLog.js');
const { GetCypressLog } = require('./getCypressLog.js');

const monitorPipeline = ({ getCypressProcess, specs }) => {
  const {
    MAX_PIPELINE_DURATION,
    PIPELINE_WARNING_THRESHOLD,
    PIPELLINE_CHECK_TIME,
  } = require('./utils/constants.js');

  const { getPipelineData } = require('./utils/helpers.js'); 
  const { prData, BUILD_ID } = getPipelineData();

  let startTime = Date.now();

  // Monitor elapsed time and trigger new pipeline
  const intervalId = setInterval(async () => {
    const elapsedTime = Date.now() - startTime;
    // Using closure
    const cypressProcess = getCypressProcess();

    if (
      elapsedTime >= PIPELINE_WARNING_THRESHOLD &&
      elapsedTime < MAX_PIPELINE_DURATION
    ) {
      console.log(
        'WARNING: Pipeline will exceed the maximum allowed time in less than 1 minute.'
      );
    } else if (elapsedTime >= MAX_PIPELINE_DURATION) {
      console.log('Pipeline exceeded maximum allowed time. EXITING...');

      let pipelineState;
      // Kill the Cypress process
      if (cypressProcess) {
        console.log('Before triggering pipeline');
        cypressProcess.kill();

        // Get current pipeline history
        const { pipelineHistory, isExecutionCompleted } = await GetCypressLog();
        pipelineState = pipelineHistory.find(
          (history) => history.buildId === BUILD_ID
        )?.state;
        // If there are specs remaining to execute
        if (!isExecutionCompleted) {
          console.log('Non-executed specs found. Triggering pipeline...');
          clearInterval(intervalId);
          const buildId = await triggerAzurePipeline();
          await UpsertCypressLog({
            pr: prData,
            specs: specs,
            buildId: buildId,
          });
        }
      }
      clearInterval(intervalId);
      console.log('Current Pipeline State: ', pipelineState);
      if (pipelineState === 'succeeded') {
        console.log('Exiting command with code: 0');
        process.exit(0); // Exit script as success
      } else {
        console.log('Exiting command with code: 1');
        process.exit(1); // Exit script as failure
      }
    }

  }, PIPELLINE_CHECK_TIME); // Check every minute (adjust interval as needed)

  return intervalId;
};

module.exports = { monitorPipeline };
