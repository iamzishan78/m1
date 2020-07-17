import gql from "graphql-tag";

export const OPERATORSLATSLONS = gql`
  query getOperatorLatsLonsArray($operatorName: String) {
    operatorLatsLonsArray(operatorName: $operatorName)
  }
`;
