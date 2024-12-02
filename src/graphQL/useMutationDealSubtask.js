import gql from 'graphql-tag';

export const ADD_DEAL_SUBTASK = gql`
	mutation addSubtask($task: JSON, $pipeline: ID, $relatedObject: ID) {
		addSubtask(task: $task, pipeline: $pipeline, relatedObject: $relatedObject) {
			success
			error
			message
			task
		}
	}
`;

export const UPDATE_DEAL_SUBTASK = gql`
	mutation updateSubtask($task: JSON, $tasks: [JSON]) {
		updateSubtask(task: $task, tasks: $tasks) {
			success
			message
			error
			task
		}
	}
`;
