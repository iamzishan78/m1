import gql from "graphql-tag";

export const SHAPEWELLS = gql`
  query getShapeWells($polygon: String) {
    shapeWells(polygon: $polygon) {
      success
      message
      results {
        id
        isTracked
        commentsCounter
        tags
        coordinates
        wellName
        api
        operator
        wellType
        latitude
        longitude
        wellBoreProfile
        ownerCount

        wellStatus
        lastTwelveMonthBOE
        permitApprovedDate
        permitApprovedDateReady
        spudDate
        spudDateReady
        completionDate
        completionDateReady
        firstProductionDate
        firstProductionDateReady
      }
    }
  }
`;
