import gql from "graphql-tag";

export const UPDATE_SHAPE_WELL_INTEREST = gql`
  mutation UpdateShapeWellInterest($wellInterest: wellInterestInput!) {
    updateShapeWellInterest(wellInterest: $wellInterest)
  }
`;
