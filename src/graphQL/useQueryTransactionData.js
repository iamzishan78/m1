import gql from "graphql-tag";

export const TRANSACTIONDATA = gql`
  query getTransactionData {
    transactionData {
      _id
      allData
    }
  }
`;
