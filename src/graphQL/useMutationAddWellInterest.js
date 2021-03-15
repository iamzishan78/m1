import gql from "graphql-tag";

export const ADDWELLINTEREST = gql`
  mutation AddWellInterest(
    $globalWellId: String,
    $userId: ID,
    $contactId: ID,
    $interestOwner: String,
    $interestOwnerType: String,
    $type: String,
    $interest: Float,
    $value: Float,
    $nra: Float,
    $year: Int,
    $globalLod: String
  ) {
    addWellInterest(
      globalWellId: $globalWellId,
      userId: $userId,
      contactId: $contactId,
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
