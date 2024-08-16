import gql from 'graphql-tag';

export const GET_ES_SIMPLE_WELLS = gql`
  query getESSimpleWells(
    $index: String
    $search: esSearchInput
    $filters: [esFilterInput]
    $sort: esSortInput
    $pagination: esPaginationInput
  ) {
    getESSimpleWells(
      index: $index
      search: $search
      filters: $filters
      sort: $sort
      pagination: $pagination
    ) {
      error
      total
      # pit
      # before_pit
      hits {
        api
        id
        wellName
        wellType
        wellStatus
        geoJSON
        # hasLine
        # latitude
        # longitude
        # Id
        # _id
        # Latitude
        # Longitude

        # operator
        # wellBoreProfile
        # wellStatus
        # primaryFormation
        # play
        # field

        # trueVerticalDepth
        # measuredDepth
        # lateralLength

        # permitApprovedDate
        # spudDate
        # completionDate
        # firstProductionDate
      }
    }
  }
`;
