const gql = require('graphql-tag');

const GET_CYPRESS_LOG = gql`
  query getCypressLog($prId: String!, $sourceBranch: String ) {
    getCypressLog(prId: $prId, sourceBranch: $sourceBranch)   
  }
`;

module.exports = { GET_CYPRESS_LOG };
