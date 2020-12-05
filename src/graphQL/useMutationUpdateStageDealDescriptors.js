import gql from "graphql-tag";

export const UPDATESTAGEDEALDESCRIPTORS = gql`
  mutation updateStageDealDescriptors($stageDealDescriptors: [StageDealDescriptorInput]!) {
    updateStageDealDescriptors(stageDealDescriptors: $stageDealDescriptors) {
        success
        error
        message
        stageDealDescriptors
    }
  }
`;
