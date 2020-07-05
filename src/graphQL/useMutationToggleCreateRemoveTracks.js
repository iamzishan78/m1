import gql from "graphql-tag";

export const TOGGLETRACKS = gql`
  mutation ToggleCreateRemoveTracks($tracks: [TrackInput]) {
    toggleCreateRemoveTracks(tracks: $tracks) {
      success
      tracking
      error
    }
  }
`;
