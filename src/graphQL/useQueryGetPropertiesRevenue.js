import gql from "graphql-tag";

export const GET_PROPERTIES_REVENUE = gql`
  query getPropertiesRevenue($filters :[JSON], $filterDate: JSON) {
    getPropertiesRevenue(filters: $filters, filterDate: $filterDate)
  }
`;
