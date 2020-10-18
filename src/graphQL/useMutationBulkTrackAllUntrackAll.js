import gql from "graphql-tag";

export const BULKTRACKALLUNTRACKALL = gql`
  mutation bulkTrackAllUntrackAll($tracks: [TrackInput], $trackAll: Boolean) {
    bulkTrackAllUntrackAll(tracks: $tracks, trackAll: $trackAll) {
      success
      error
    }
  }
`;
