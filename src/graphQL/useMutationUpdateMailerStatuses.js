import gql from "graphql-tag";

export const UPDATEMAILERSTATUSES = gql`
  mutation UpdateMailerStatuses(
    $userId:ID
  ) {
    updateMailerStatuses(
      userId: $userId
    )
  }
`;
