import gql from "graphql-tag";

export const GET_MY_WELL_BY_GLOBAL_ID = gql`
  query getMyWellByGlobalId($wellId: String) {
    myWellByGlobalId(wellId: $wellId)
  }
`;
