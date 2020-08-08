import gql from "graphql-tag";

export const GETPERSONDATA = gql`
    query getPersonData($persons: [JSON]) {
        getPersonData(persons: $persons)
    }
`
