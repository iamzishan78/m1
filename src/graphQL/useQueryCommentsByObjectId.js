import gql from 'graphql-tag';

export const COMMENTSBYOBJECTIDQUERY = gql`
	query getCommentsByObjectId($objectId: String) {
		commentsByObjectId(objectId: $objectId) {
			_id
			comment
			commentType
			ts
			isEdited
			public
			pin
			user {
				name
				email
			}
			commentedOn
			likedBy {
				_id
				name
				displayName
			}
		}
	}
`;
