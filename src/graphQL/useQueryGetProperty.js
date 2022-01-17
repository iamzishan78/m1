import gql from "graphql-tag";

export const GET_PROPERTY = gql`
  query getProperty($id:ID){
    getProperty(propertyId:$id)
  }
`;


