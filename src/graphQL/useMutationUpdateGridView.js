import gql from "graphql-tag";

export const UPDATE_GRID_VIEW = gql`
  mutation updateGridView($gridView: gridViewInput) {
    updateGridView(gridView: $gridView)
  }
`;
