import gql from "graphql-tag";

export const DELETE_MY_WELL = gql`
  mutation deleteMyWell($myWellId: ID) {
    deleteMyWell(myWellId: $myWellId)
  }
`;
