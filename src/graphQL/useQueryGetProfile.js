import React from "react";
import gql from "graphql-tag";

export const GETPROFILE = gql`
    query getProfilebyemail($email: String) {
        profileByEmail(userEmail: $email){
            success
            profile {
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
    }
`
export const GETPROFILEIMAGE = gql`
    query getProfileImage($email: String) {
        profileByEmail(userEmail: $email){
            success
            profile {
                fullname
                email
                profileImage             
            }
        }
    }
`