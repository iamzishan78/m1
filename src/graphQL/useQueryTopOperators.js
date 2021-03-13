// query is intended to get the top operators by well count 
// for use in the application 
// in particular the filters 

import gql from "graphql-tag";

export const TOPOPERATORS = gql`
query {
    topOperators {
      CurrentOperator
    }
  }
`;
