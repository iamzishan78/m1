import gql from "graphql-tag";

export const REMOVE_WELLS = gql`
  mutation removeWells($wellIds: [ID], $userId: String) {
    removeWells(wellIds: $wellIds, userId: $userId) {
      success
      message
      error
      agreement
    }
  }
`;

// import gql from "graphql-tag";

// export const REMOVE_AGREEMENTS = gql`
//   mutation removeAgreements($agreementIds: [ID], $userId: String) {
//     removeAgreements(agreementIds: $agreementIds, userId: $userId) {
//       success
//       message
//       error
//       agreement
//     }
//   }
// `;

