import gql from 'graphql-tag';

export const GETALLACTIVITIES = gql`
	query getAllActivities($category: String) {
		activities(category: $category) {
			_id
			dateTime
			endDateTime
			notes
			status
			ownerId
			contactId
			dealId
			dealName
			type
			ownerName
			contactName
			frequency
			applicable
			value
			responsibleParty
			name
			isClosed
			createBy
			lastUpdateBy
			outcome
			createAt
			lastUpdateAt
		}
	}
`;

export const GETALLACTIVITIESFORSEARCH = gql`
	query getAllActivitiesForSearch($category: String) {
		activities(category: $category) {
			_id
			name
			type
		}
	}
`;
