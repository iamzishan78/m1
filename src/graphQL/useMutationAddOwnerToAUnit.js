import gql from "graphql-tag";

export const ADD_OWNER_TOA_UNIT = gql`
  mutation addOwnerToAUnit($unitOwner: JSON) {
    addOwnerToAUnit(unitOwner: $unitOwner)
  }
`;
