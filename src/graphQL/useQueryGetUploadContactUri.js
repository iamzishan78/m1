import gql from "graphql-tag";

export const GET_UPLOAD_CONTACT_URI = gql`
    query getUploadContactUri($jobName: String, $userId: String) {
        getUploadContactUri (jobName: $jobName, userId: $userId)
    }
`