import gql from 'graphql-tag';

export const TOGGLECOMMENTREACTION = gql`
	mutation ToggleCommentReaction($commentId: ID) {
		toggleReactionOnComment(commentId: $commentId) {
			success
			message
			error
		}
	}
`;
