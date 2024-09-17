// Core modules
const path = require('path');
const { exec, execSync } = require('child_process');

// Custom modules for pipeline management
const { GetCypressLog } = require('./getCypressLog.js');
const { ResetPipeline } = require('./resetPipeline.js');
const { UpsertCypressLog } = require('./upsertCypressLog.js');

// Utility modules
const { fetchPullRequests } = require('./utils/fetchPullRequest.js');
const { fetchCypressSpecs } = require('./utils/fetchCypresssSpecs.js');

// Pipeline monitoring and triggering modules
const { monitorPipeline } = require('./monitorPipeline.js');
const { triggerAzurePipeline } = require('./triggerAzurePipeline.js');

// Paths for dependencies
const crossEnvCommand = path.resolve(__dirname, '../../../node_modules/.bin/cross-env');
const startServerAndTestCommand = path.resolve(__dirname, '../../../node_modules/.bin/start-server-and-test');
const cypressCommand = path.resolve(__dirname, '../../../node_modules/.bin/cypress');

// Main script function
(async function () {
  try {
    let cypressProcess;
    let finalSpecsString;

    // Step 1: Fetch Pull Requests and set them in the environment
    const pullRequests = await fetchPullRequests();
    if(pullRequests &&  pullRequests.length > 0) {
        process.env.pullRequestData = JSON.stringify(pullRequests[0]);
    }

    // Step 2: Retrieve pipeline data
    const { getPipelineData } = require('./utils/helpers.js');
    const { PIPELINE_RUN_MODES } = require('./utils/constants.js');
    const { prData, PIPELINE_RUN_MODE, PIPELINE_TRIGGER_MODE } = getPipelineData();

    // Log pipeline modes
    console.log(`Pipeline Trigger Mode: ${PIPELINE_TRIGGER_MODE?.toUpperCase()}`);
    console.log(`Pipeline Run Mode: ${PIPELINE_RUN_MODE?.toUpperCase()}`);

    // Step 3: Fetch system specs
    const systemSpecs = await fetchCypressSpecs();
    
    // Step 4: Start monitoring the pipeline
    const intervalId = monitorPipeline({ getCypressProcess: () => cypressProcess, specs: systemSpecs })

    // Login for cypress using login.cy.js
    try {
      execSync(
        `${crossEnvCommand} START_SERVER_AND_TEST_INSECURE=1 ${startServerAndTestCommand} cypress:start http://localhost:3000 "${cypressCommand} run --spec 'cypress/e2e/login.cy.js' --browser chrome"`,
        {
          stdio: 'inherit', // This will print the command's output to the console
        }
      );
    } catch (error) {
      console.log('Login Command Error', error.message);
      process.exit(1); // Exit the process
    }

    // Reset pipeline if necessary
    const { resetSpecsString } = await ResetPipeline({ isUpdateReset: false });

    // Upsert the cypress logs
    const { specsString, currentState } = await UpsertCypressLog({
      pr: prData,
      specs: systemSpecs,
    });

    // Use either specs tring from reset process or upsert process
    if ([PIPELINE_RUN_MODES.FAILED_ONLY, PIPELINE_RUN_MODES.PASSED_ONLY].includes(PIPELINE_RUN_MODE))
      finalSpecsString = resetSpecsString;
    else
      finalSpecsString = specsString;
      
    // Run all the specs returned by API
    if (finalSpecsString) {
      try {
        cypressProcess = exec(
          `${crossEnvCommand} NODE_OPTIONS=\"--max_old_space_size=32768 --openssl-legacy-provider\" ${cypressCommand} run --component --spec '${finalSpecsString}' --browser chrome`
        );

        // Log the command output
        cypressProcess.stdout.on('data', (data) => {
          console.log(data);
        });

        // Log the command errors
        cypressProcess.stderr.on('data', (data) => {
          console.error(data);
        });

        // Close the monitoring if the command was successfully closed before max duration
        cypressProcess.on('close', async (code) => {
          clearInterval(intervalId);
          const { isExecutionComplete, retries, failedSpecs, currentState, isResetDone } = await GetCypressLog();

          if (isExecutionComplete && retries === 1 && failedSpecs?.length > 0) {
            console.log('Failed specs found. Triggering pipeline one more time...');
            const buildId = await triggerAzurePipeline();
            await UpsertCypressLog({ pr: prData, specs: systemSpecs, buildId: buildId, isFailedRetry: true});
          } else if(isResetDone) { 
            // Update the reset status for future pipeline
            await ResetPipeline({ isUpdateReset: true });
          }
          console.log('Exiting command with code: ', code);
          console.log('Current pipeline state: ', currentState?.toUpperCase());
          process.exit(code);
        });
      } catch (error) {
        console.log('Error Running Test Cases', error.message);
        process.exit(1);
      }
    } else {
      clearInterval(intervalId);
      // Update the reset status for future pipeline
      await ResetPipeline({ isUpdateReset: true });

      console.log("No specs found for execution...");
      console.log('Current pipeline state: ', currentState?.toUpperCase());
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
