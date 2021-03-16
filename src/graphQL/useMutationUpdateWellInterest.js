import gql from "graphql-tag";

export const UPDATEWELLINTEREST = gql`
  mutation UpdateWellInterest(
    $id: ID,
    $globalWellId: String,
    $lease: String,
    $leaseAcres: Float,
    $interestOwner: String,
    $interestOwnerType: String,
    $type: String,
    $interest: Float,
    $value: Float,
    $nra: Float,
    $year: Int,
    $globalLod: String
  ) {
    updateWellInterest(
      id: $id,
      globalWellId: $globalWellId,
      lease: $lease,
      leaseAcres: $leaseAcres,
      interestOwner: $interestOwner,
      interestOwnerType: $interestOwnerType,
      type: $type,
      interest: $interest,
      value: $value,
      nra: $nra,
      year: $year,
      globalLod: $globalLod,
    )
  }
`;
