import gql from "graphql-tag";

export const GET_PROPERTIES_REVENUE = gql`
  query getPropertiesRevenue($filters :[JSON], $filterDate: JSON, $allDates: Boolean) {
    getPropertiesRevenue(filters: $filters, filterDate: $filterDate, allDates: $allDates)
  }
`;
