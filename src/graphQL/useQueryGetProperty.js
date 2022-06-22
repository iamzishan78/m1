import gql from "graphql-tag";

export const GET_PROPERTY = gql`
  query getProperty($id:ID){
    getProperty(propertyId:$id)
  }
`;

export const GET_ACQUISITION_AUTOCOMPLETE_LIST = gql`
  query getAquisitionAutoCompleteList {
    getAquisitionAutoCompleteList
  }
`;


