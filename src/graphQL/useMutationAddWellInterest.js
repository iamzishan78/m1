import gql from "graphql-tag";

export const ADDWELLINTEREST = gql`
  mutation AddWellInterest(
    $globalWellId: String,
    $userId: ID,
    $contactId: ID,
    $entity: String,
    $type: String,
    $interest: Float,
    $value: Float,
    $nra: Float
  ) {
    addWellInterest(
      globalWellId: $globalWellId,
      userId: $userId,
      contactId: $contactId,
      entity: $entity,
      type: $type,
      interest: $interest,
      value: $value,
      nra: $nra
    )
  }
`;
