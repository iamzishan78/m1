import gql from "graphql-tag";

export const IFARECONTACTS = gql`
  query checkIfOwnersAreContacts($idsArray: [String], $gLodIdsArray:[String]) {
    ifAreContacts(idsArray: $idsArray, gLodIdsArray: $gLodIdsArray)
  }
`;
