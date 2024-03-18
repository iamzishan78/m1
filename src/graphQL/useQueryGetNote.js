import gql from "graphql-tag";
export const GET_USER_NOTES = gql`
  query GetUserNotes($userId: String) {
    getUserNotes(userId: $userId) {
      description
    }
  }
`;