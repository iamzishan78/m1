const { exec, execSync } = require('child_process');
const { fetchCypressSpecs } = require('./utils/fetchCypresssSpecs.js');
const { UpsertCypressLog } = require('./upsertCypressLog.js');
const { GetCypressLog } = require('./getCypressLog.js');
const { triggerAzurePipeline } = require('./triggerAzurePipeline.js');
const { monitorPipeline } = require('./monitorPipeline.js');
const { fetchPullRequests } = require('./utils/fetchPullRequest.js');

const path = require('path');
const crossEnvCommand = path.resolve(__dirname, '../../../node_modules/.bin/cross-env');
const startServerAndTestCommand = path.resolve(__dirname, '../../../node_modules/.bin/start-server-and-test');
const cypressCommand = path.resolve(__dirname, '../../../node_modules/.bin/cypress');

(async function () {
  try {
    let cypressProcess;

    // Get PR data and serialize the object to as an env JSON string
    const pullRequests = await fetchPullRequests();
    if(pullRequests &&  pullRequests.length > 0) {
        process.env.pullRequestData = JSON.stringify(pullRequests[0]);
    }

    const { getPipelineData } = require('./utils/helpers.js');
    const { prData } = getPipelineData();

    // Fetch all system specs
    const systemSpecs = await fetchCypressSpecs();

    // Start monitoring pipeline
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

    // Upsert the cypress logs
    const { specsString } = await UpsertCypressLog({
      pr: prData,
      specs: systemSpecs,
    });

    // Run all the specs returned by API
    if (specsString) {
      try {
        cypressProcess = exec(
          `${crossEnvCommand} NODE_OPTIONS=\"--max_old_space_size=32768 --openssl-legacy-provider\" ${cypressCommand} run --component --spec '${specsString}' --browser chrome`
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
          const { isExecutionComplete, retries } = await GetCypressLog();
          if (isExecutionComplete && retries === 1) {
            console.log('Failed specs found. Triggering pipeline one more time...');
            const buildId = await triggerAzurePipeline();
            await UpsertCypressLog({ pr: prData, specs: systemSpecs, buildId: buildId, isFailedRetry: true});
          }
          console.log('Exiting command with code: ', code)
          process.exit(code);
        });
      } catch (error) {
        console.log('Error Running Test Cases', error.message);
        process.exit(1);
      }
    } else {
      clearInterval(intervalId);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
