import gql from "graphql-tag";

export const UPDATE_UNIT_OWNER = gql`
  mutation updateUnitOwner($unitOwner: JSON) {
    updateUnitOwner(unitOwner: $unitOwner)
  }
`;
