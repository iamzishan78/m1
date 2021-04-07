import gql from "graphql-tag";

export const REMOVEDEALDESCRIPTOR = gql`
  mutation removeDealDescriptor($id: ID) {
    removeDealDescriptor(contactId: $id) {
      success
      message
      error
    }
  }
`;
