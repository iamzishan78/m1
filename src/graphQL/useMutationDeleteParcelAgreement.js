import gql from "graphql-tag";

export const DELETE_PARCEL_RUNSHEET = gql`
  mutation deleteParcelAgreement($id: ID) {
    deleteParcelAgreement(id: $id)
  }
`;
