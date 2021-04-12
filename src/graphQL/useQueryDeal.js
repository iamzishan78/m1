import gql from "graphql-tag";

export const GETDEAL = gql`
  query getDeal($id:ID){
    deal(dealId:$id)
  }
`;