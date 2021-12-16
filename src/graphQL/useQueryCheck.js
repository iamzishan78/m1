import gql from "graphql-tag";

export const GETCHECK = gql`
  query getCheck($id:ID){
    findCheck_Flat(checkId:$id)
  }
`;