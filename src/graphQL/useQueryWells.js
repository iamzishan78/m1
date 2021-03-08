import gql from "graphql-tag";

export const WELLSQUERY = gql`
  query getWells($wellIdArray: [String]) {
    wells(wellIdArray: $wellIdArray) {
      success
      message
      results {
        id
        wellName
        api
        state
        county
        operator
        wellType
        latitude
        longitude
        wellBoreProfile
        ownerCount
        wellStatus
        lastTwelveMonthBOE
        permitApprovedDate
        spudDate
        completionDate
        firstProductionDate
        isTracked
      }
    }
  }
`;
