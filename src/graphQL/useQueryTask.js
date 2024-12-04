import gql from 'graphql-tag';

export const STAGE_TASK_TEMPLATE = gql`
	query getTaskTemplate($stageId: ID, $pipelineId: ID) {
		stageTaskTemplate(stageId: $stageId, pipelineId: $pipelineId)
	}
`;
