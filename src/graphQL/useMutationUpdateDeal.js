import gql from "graphql-tag";

export const UPDATEDEAL = gql`
  mutation updateDeal($deal: JSON) {
    updateDeal(deal: $deal) {
      success
      message
      error
      deal
    }
  }
`;
