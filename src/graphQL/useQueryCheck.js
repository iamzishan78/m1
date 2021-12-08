import gql from "graphql-tag";

export const GETCHECK = gql`
  query getCheck($id:ID){
    check(checkId:$id)
  }
`;