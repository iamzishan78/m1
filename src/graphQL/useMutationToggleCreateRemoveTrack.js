import gql from "graphql-tag";

export const TOGGLETRACK = gql`
  mutation ToggleCreateRemoveTrack($track: TrackInput) {
    toggleCreateRemoveTrack(track: $track) {
      success
      tracking
      error
    }
  }
`;
