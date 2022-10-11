import gql from "graphql-tag";

export const GET_PROPERTY = gql`
  query getProperty($id:ID){
    getProperty(propertyId:$id)
  }
`;

export const GET_UNMAPPED_PROPERTY_COUNT = gql`
  query getUnmappedPropertyCount {
    getUnmappedPropertyCount
  }
`;

export const GET_AUTOCOMPLETE_PROPERTY_LIST = gql`
  query getAutoCompletePropertyList($key: String) {
    getAutoCompletePropertyList(key: $key)
  }
`;


