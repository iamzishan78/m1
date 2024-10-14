const { execSync } = require('child_process');

const triggerAzurePipeline = async () => {
  try {
    const { SOURCE_BRANCH, TENENT, AZURE_TOKEN, ORGANIZATION } = require('./utils/constants');
    // Set up Azure DevOps CLI authentication using PAT
    console.log('Authenticating with Azure DevOps...');
    try {
      execSync(
        `echo "${AZURE_TOKEN}" | az devops login --organization ${ORGANIZATION}`,
        {
          stdio: 'inherit', // This will print the command's output to the console
        }
      );
      console.log('Authentication successful.');
    } catch (error) {
      console.log('Azure Login Command Error', error.message);
      process.exit(1); // Exit the process
    }

    // Trigger the Azure DevOps pipeline
    console.log('Triggering Azure DevOps pipeline...');
    try {
      const output = execSync(
        `az pipelines run --branch '${SOURCE_BRANCH}' --name 'M1 - Component Testing' --org '${ORGANIZATION}' --project 'Platform MVP' --variables "TENENT=${TENENT}" --output json | jq -r '.id'`,
        {
          stdio: 'pipe', // This will print the command's output to the console
        }
      );

      // Fetch the build id of new pipeline
      const buildId = output?.toString()?.trim();
      console.log(`Pipeline triggered successfully with build ID: ${buildId}`);

      return buildId;
    } catch (error) {
      console.log('Error triggering pipeline', error.message);
      process.exit(1); // Exit the process
    }
  } catch (error) {
    console.error('Azure Pipeline Error:', error.message);
    process.exit(1);
  }
};

module.exports = { triggerAzurePipeline };
