import gql from "graphql-tag";

export const UPDATEWELLINTEREST = gql`
  mutation UpdateWellInterest($wellInterest: wellInterestInput!) {
    updateWellInterest(wellInterest: $wellInterest)
  }
`;
