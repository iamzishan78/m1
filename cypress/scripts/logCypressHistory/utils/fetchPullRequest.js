const axios = require('axios');
const btoa = require('btoa'); // Base64 encoding utility

const {
  AZURE_TOKEN,
  ORGANIZATION,
  PROJECT_ID,
  REPOSITORY_ID,
  SOURCE_BRANCH,
} = require('./constants');

const branchName = SOURCE_BRANCH?.replace('refs/heads/', ''); // Remove 'refs/heads/' from branch name
const prUri = `${ORGANIZATION}${PROJECT_ID}/_apis/git/repositories/${REPOSITORY_ID}/pullrequests?searchCriteria.sourceRefName=refs/heads/${branchName}&api-version=7.1`; // PR API endpoint
const headers = {
  Authorization: `Basic ${btoa(':' + AZURE_TOKEN)}`,
};

const fetchPullRequests = async () => {
  try {
    const prResp = await axios.get(prUri, { headers });

    if (prResp && prResp.data.value) {
      const prData = prResp.data.value; // Access PR data from response

      // Map through PR data to extract desired information
      const pullRequests = prData.map((pr) => ({
        pullRequestId: pr.pullRequestId,
        title: pr.title,
        status: pr.status,
        sourceBranch: pr.sourceRefName,
        targetBranch: pr.targetRefName,
        createdBy: pr.createdBy.displayName,
        creationDate: pr.creationDate,
      }));

      // Sort pull requests by creationDate in descending order
      const sortedPullRequests = pullRequests.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
      );

      return sortedPullRequests;
    } else {
      return [];
    }
  } catch (error) {
    console.log('Error in getting pull requests: ', error.message);
  }
};

module.exports = { fetchPullRequests };
