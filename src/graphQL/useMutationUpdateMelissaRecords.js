import gql from "graphql-tag";

export const UPDATEMELISSAADDRESS = gql`
  mutation UpdateMelissaAddressRecord($melissaAddressRecord: JSON) {
    updateMelissaAddressRecord(melissaAddressRecord: $melissaAddressRecord)
  }
`;

export const UPDATEMELISSA = gql`
  mutation UpdateMelissaRecord($melissaRecord: JSON) {
    updateMelissaRecord(melissaRecord: $melissaRecord)
  }
`;
