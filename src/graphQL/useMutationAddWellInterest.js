import gql from "graphql-tag";

export const ADDWELLINTEREST = gql`
  mutation AddWellInterest($wellInterest: wellInterestInput!) {
    addWellInterest(wellInterest: $wellInterest)
  }
`;
