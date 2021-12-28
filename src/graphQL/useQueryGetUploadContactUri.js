import gql from "graphql-tag";

export const GET_UPLOAD_CONTACT_URI = gql`
    query getUploadContactUri($jobName: JobType, $userId: String) {
        getUploadContactUri (jobName: $jobName, userId: $userId)
    }
`