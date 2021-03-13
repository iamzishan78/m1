import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";

export default function useQueryTopOperators() {
const TopOperatorsFilterQUERY = gql`query {
    topOperators 
  }
`;

return useLazyQuery(TopOperatorsFilterQUERY);
}