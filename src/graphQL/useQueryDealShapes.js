import gql from "graphql-tag";

export const GET_DEAL_SHAPES = gql`
  query getDealShapes($contactId: ID, $contactIds: [ID], $dealId: ID) {
    dealShapes(contactId: $contactId, contactIds: $contactIds, dealId: $dealId)
  }
`;
