import gql from "graphql-tag";

export const DELETE_PARCEL_RUNSHEET = gql`
  mutation deleteParcelAgreement($id: ID $parcelId: ID, $fileId: ID) {
    deleteParcelAgreement(id: $id, parcelId: $parcelId, fileId: $fileId)
  }
`;
