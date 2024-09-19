const gql = require('graphql-tag');

const UPSERT_CYPRESS_LOG = gql`
  mutation upsertCypressLog($log: JSON) {
    upsertCypressLog(log: $log) {
      status
      message
      specs {
        spec
        failureCount
        testcases {
          testcase
          reason
          isPassed
          isExecuted
        }
      }
      specsString
      isExecutionComplete
      retries
      currentState
    }
  }
`;

const RESTORE_SPEC_DATA = gql`
  mutation restoreSpecData($spec: String!) {
    restoreSpecData(spec: $spec) {
      success
      message
    }
  }
`;

module.exports = { UPSERT_CYPRESS_LOG, RESTORE_SPEC_DATA };
