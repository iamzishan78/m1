import gql from "graphql-tag";

export const GET_ASSOCIATED_WELL_PRODUCTION_DATA = gql`
  query getAssociatedWellProductionData($relatedObject: ID) {
    getAssociatedWellProductionData(relatedObject: $relatedObject)
  }
`;
