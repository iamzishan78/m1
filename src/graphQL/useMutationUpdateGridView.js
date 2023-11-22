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

export const UPDATE_DEFAULT_GRID_VIEW = gql`
  mutation updateDefaultGridView($id: ID, $userId: ID, $operation: String, $module: String) {
    updateDefaultGridView(id: $id, userId: $userId, operation: $operation, module: $module)
  }
`;
