import gql from "graphql-tag";

export const UPDATETRANSACTION = gql`
  mutation updateTransaction(
    $transactionId: ID
    $transaction: TransactionInput
  ) {
    updateTransaction(
      transactionId: $transactionId
      transaction: $transaction
    ) {
      success
      message
      error
      transaction {
        _id
        allData
      }
    }
  }
`;
