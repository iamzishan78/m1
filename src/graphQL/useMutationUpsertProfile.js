import React from "react";
import gql from "graphql-tag";

export const UPSERTPROFILE = gql`
    mutation upsertProfile($profileData: ProfileInput ){
        upsertProfile(profile: $profileData) {
            success
            message
        }
    }
`;
