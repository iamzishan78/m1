import gql from "graphql-tag";

export const UPSERT_MY_WELL = gql`
  mutation upsertMyWell($myWell: JSON) {
    upsertMyWell(myWell: $myWell)
  }
`;
