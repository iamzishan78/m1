import gql from "graphql-tag";

export const GETPERSONDATA = gql`
    query getPersonData($firstName: String, $lastName: String, $address: String, $city: String, $state:String) {
        getPersonData(firstName: $firstName, lastName: $lastName, address: $address, city: $city, state: $state) {
            addressLine1
            addressLine2
            city
            state
            companyName
            emailAddress
            phoneNumber
            postalCode
            nameFull
        }
    }
`
