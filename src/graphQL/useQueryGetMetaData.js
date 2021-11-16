import gql from "graphql-tag";

export const GET_META_DATA = gql`
  query getMetaData( $user: ID, $category: String) {
    getMetaData(
      user: $user,
      category: $category
    )
  }
`;
