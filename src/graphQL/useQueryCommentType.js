import gql from 'graphql-tag';

export const GET_COMMENT_TYPES = gql`
	query getAllCommentsType {
		commentsType {
			_id
			commentType
			category
		}
	}
`;

export const UPSERTCOMMENTTYPE = gql`
	mutation UpsertCommentsType($commentType: CommentsTypeInput) {
		upsertCommentsType(payload: $commentType) {
			success
			message
			data {
				_id
				commentType
				category
			}
		}
	}
`;
