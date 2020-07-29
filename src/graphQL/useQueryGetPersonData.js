import gql from "graphql-tag";

export const GETPERSONDATA = gql`
    query getPersonData($persons: [JSON]) {
        getPersonData(persons: $persons)
    }
`

export const GETPERSONDATALOOKUP = gql`
    query getPersonDataLookup($persons: [JSON]) {
        getPersonDataLookup(persons: $persons)
    }
`