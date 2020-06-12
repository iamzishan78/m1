import React from "react";
import gql from "graphql-tag";

export const GETPROFILE = gql`
    query getProfilebyemail($email: String) {
        profileByEmail(userEmail: $email){
            fullname
            email
            phone
            profileImage
            displayname
            _id
            timezone
            activity
            ts
        }
    }
`