import gql from "graphql-tag";

export const UPDATE_GRID_VIEW = gql`
  mutation updateGridView($gridView: gridViewInput) {
    updateGridView(gridView: $gridView)
  }
`;

export const UPDATE_FAVOURITE_GRID_VIEW = gql`
  mutation updateFavouriteGridView($id: ID, $userId: ID, ) {
    updateFavouriteGridView(id: $id, userId: $userId)
  }
`;
