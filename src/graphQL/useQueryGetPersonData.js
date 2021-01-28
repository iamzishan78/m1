import gql from "graphql-tag";

export const GETPERSONDATA = gql`
  mutation getPersonData($persons: [JSON]) {
    getPersonData(persons: $persons)
  }
`;
