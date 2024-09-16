const BUILD_ID = process.env.BUILD_ID;
const SOURCE_BRANCH = process.env.SOURCE_BRANCH;
// const PIPELINE_RUN_MODE = process.env.PIPELINE_RUN_MODE;
// const PIPELINE_TRIGGER_MODE = process.env.PIPELINE_TRIGGER_MODE;
const PIPELINE_RUN_MODE = 'passed_only';
const PIPELINE_TRIGGER_MODE = 'Manual';

const MAX_PIPELINE_DURATION = 10 * 60 * 1000; // 55 minutes in milliseconds
const PIPELINE_WARNING_THRESHOLD = 8 * 60 * 1000; // 50 minutes in milliseconds
const PIPELLINE_CHECK_TIME = 1 * 60 * 1000; // 1 minutes in milliseconds

const TENENT = process.env.TENENT;
const AZURE_TOKEN = 'fhlqorwhmhmbwhxgtdvyp65f4pbgpirhel76yr2gficycbryvsqq';
// const AZURE_TOKEN = process.env.AZURE_ACCESS_TOKEN;
const ORGANIZATION = 'https://dev.azure.com/m1neral/';
const PROJECT_ID = 'afc3f37f-b77c-4b2d-a9fd-455686d0ef31';
const REPOSITORY_ID = '388272b2-6847-40a2-aa97-30d73a0d7e74';

const CYPRESS_FILE_PATTERN = 'cypress/component/DetailPages/**/*.cy*';

const dummyPR = {
  pullRequestId: 1234,
  title: 'Executing pipeline locally',
  status: 'active',
  sourceBranch: 'refs/heads/abc',
  targetBranch: 'refs/heads/xyz',
  createdBy: 'Local tester',
  creationDate: '2024-09-03T11:31:57.1883747Z',
};

const dummyBuildId = '8321';

const PIPELINE_STATUSES = Object.freeze({
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const PIPELINE_TRIGGER_MODES = Object.freeze({
  MANUAL: 'Manual',
  SCHEDULE: 'Schedule',
});

const PIPELINE_RUN_MODES = Object.freeze({
  NORMAL: 'normal',
  FAILED_ONLY: 'failed_only',
  PASSED_ONLY: 'passed_only',
  RESET: 'reset',
});

module.exports = {
  dummyPR,
  dummyBuildId,
  BUILD_ID,
  PIPELINE_RUN_MODE,
  PIPELINE_TRIGGER_MODE,
  SOURCE_BRANCH,
  MAX_PIPELINE_DURATION,
  PIPELINE_WARNING_THRESHOLD,
  PIPELLINE_CHECK_TIME,
  CYPRESS_FILE_PATTERN,
  TENENT,
  AZURE_TOKEN,
  ORGANIZATION,
  PROJECT_ID,
  REPOSITORY_ID,
  PIPELINE_STATUSES,
  PIPELINE_RUN_MODES,
  PIPELINE_TRIGGER_MODES
};
