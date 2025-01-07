const axios = require('axios');
const btoa = require('btoa'); // Base64 encoding utility

const { AZURE_TOKEN, ORGANIZATION, PROJECT_ID, REPOSITORY_ID, SOURCE_BRANCH } = require('./constants');

const branchName = SOURCE_BRANCH?.replace('refs/heads/', '');
const uri = `${ORGANIZATION}${PROJECT_ID}/_apis/git/repositories/${REPOSITORY_ID}/commits?searchCriteria.itemVersion.version=${branchName}&searchCriteria.$top=3&api-version=7.1`;
const headers = {
	Authorization: `Basic ${btoa(':' + AZURE_TOKEN)}`,
};

const fetchGitCommits = async () => {
	try {
		const gitResp = await axios.get(uri, { headers });
		const commitsData = gitResp.data.value;
		const commits = commitsData
			.map(commit => ({
				message: commit.comment,
				commitId: commit.commitId,
			}))
			.sort((a, b) => b.date - a.date);
		return commits;
	} catch (error) {
		console.log('Error in getting commits: ', error.message);
	}
};

module.exports = { fetchGitCommits };
