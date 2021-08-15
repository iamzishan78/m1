import gql from "graphql-tag";

export const GET_UPLOAD_CONTACT_URI = gql`
    query getUploadContactUri($userId: String) {
        getUploadContactUri (userId: $userId)
    }
`