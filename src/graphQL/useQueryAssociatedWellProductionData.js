import gql from "graphql-tag";

export const GET_ASSOCIATED_WELL_PRODUCTION_DATA = gql`
  query getAssociatedWellProductionData($relatedObjects: [ID]) {
    getAssociatedWellProductionData(relatedObjects: $relatedObjects)
  }
`;
