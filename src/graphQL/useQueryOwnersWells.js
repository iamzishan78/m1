import gql from "graphql-tag";

export const OWNERSWELLSQUERY = gql`
  query getOwnersWells($ownersIds: [String]) {
    ownersWells(ownersIds: $ownersIds)
  }
`;
