import gql from "graphql-tag";

export const GET_PROPERTY = gql`
  query getProperty($id:ID, $isDeletedCheck: Boolean){
    getProperty(propertyId:$id, isDeletedCheck: $isDeletedCheck)
  }
`;

export const GET_UNMAPPED_PROPERTY_COUNT = gql`
  query getUnmappedPropertyCount($filters: [JSON]) {
    getUnmappedPropertyCount(filters: $filters)
  }
`;

export const GET_AUTOCOMPLETE_PROPERTY_LIST = gql`
  query getAutoCompletePropertyList($key: String) {
    getAutoCompletePropertyList(key: $key)
  }
`;


