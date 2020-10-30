import gql from "graphql-tag";

export const IFARECONTACTS = gql`
  query checkIfOwnersAreContacts($idsArray: [String]) {
    ifAreContacts(idsArray: $idsArray)
  }
`;
