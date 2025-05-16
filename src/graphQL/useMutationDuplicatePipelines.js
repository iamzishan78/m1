import gql from 'graphql-tag';

export const DUPLICATE_PIPELINES = gql`
	mutation duplicatePipelines($pipelines: [JSON], $userId: ID) {
		duplicatePipelines(pipelines: $pipelines, userId: $userId) {
			success
			message
			error
			pipelines
		}
	}
`;
