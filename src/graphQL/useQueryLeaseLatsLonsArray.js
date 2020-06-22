import gql from "graphql-tag";

export const LEASELATSLONS = gql`
  query getLeaseLatsLonsArray($fieldName: String, $value: String) {
    leaseLatsLonsArray(fieldName: $fieldName, value: $value)
  }
`;
