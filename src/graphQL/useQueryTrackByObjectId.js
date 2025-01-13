import gql from 'graphql-tag';

export const TRACKBYOBJECTID = gql`
	query trackByObjectId($objectId: String) {
		trackByObjectId(objectId: $objectId) {
			_id
			ts
			user
			objectType
			trackOn
		}
	}
`;

export const IS_TRACKED_BY_IDS = gql`
	query isTrackedByIds($ids: [String], $userId: String) {
		isTrackedByIds(ids: $ids, userId: $userId) {
			success
			data
			error
		}
	}
`;
