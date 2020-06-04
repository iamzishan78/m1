import gql from "graphql-tag";

export const COUNTIES = gql`
  query getCounties($state: String) {
    counties(state: $state) {
      county
    }
  }
`;
