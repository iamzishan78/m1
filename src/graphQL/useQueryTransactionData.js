import gql from "graphql-tag";

export const TRANSACTIONDATA = gql`
  query getTransactionData($userId: ID) {
    transactionData(userId: $userId) {
      _id
      allData
      user
    }
  }
`;
