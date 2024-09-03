const BUILD_ID = process.env.BUILD_ID;
const SOURCE_BRANCH = process.env.SOURCE_BRANCH;
const prData = {
  pullRequestId: process.env.SYSTEM_PULLREQUEST_PULLREQUESTID,
  sourceBranch: process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH,
  targetBranch: process.env.SYSTEM_PULLREQUEST_TARGETBRANCH,
  targetBranchName: process.env.SYSTEM_PULLREQUEST_TARGETBRANCHNAME,
  sourceCommitId: process.env.SYSTEM_PULLREQUEST_SOURCECOMMITID,
  sourceRepositoryUri: process.env.SYSTEM_PULLREQUEST_SOURCEREPOSITORYURI,
  pullRequestIteration: process.env.SYSTEM_PULLREQUEST_PULLREQUESTITERATION,
};

const MAX_PIPELINE_DURATION = 40 * 60 * 1000; // 40 minutes in milliseconds
const PIPELINE_WARNING_THRESHOLD = 35 * 60 * 1000; // 35 minutes in milliseconds
const PIPELLINE_CHECK_TIME = 1 * 60 * 1000; // 1 minutes in milliseconds

const TENENT = process.env.TENENT;
const AZURE_TOKEN = 'fhlqorwhmhmbwhxgtdvyp65f4pbgpirhel76yr2gficycbryvsqq';
const ORGANIZATION = 'https://dev.azure.com/m1neral/';
const PROJECT_ID = 'afc3f37f-b77c-4b2d-a9fd-455686d0ef31';
const REPOSITORY_ID = '388272b2-6847-40a2-aa97-30d73a0d7e74';

const CYPRESS_FILE_PATTERN = 'cypress/component/**/*.cy*';

const dummyPR = {
  pullRequestId: '4573',
  sourceBranch: 'refs/heads/ahmadfaraz/cypress/data-restore',
  targetBranch: 'refs/heads/master',
  targetBranchName: 'master',
  sourceCommitId: 'f2a35f91a3b1afa4cb5771ba7e3288bc5d26588e',
  sourceRepositoryUri:
    'https://m1neral@dev.azure.com/m1neral/Platform%20MVP/_git/m1',
  pullRequestIteration: '5',
};

module.exports = {
  prData,
  dummyPR,
  BUILD_ID,
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
};
