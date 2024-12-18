import gql from 'graphql-tag';

export const VERIFY_CHECK_DETAIL_JOB = gql`
	mutation verifyCheckDetailsJob(
		$sourceId: String!
		$purchaserName: String!
		$propertyNames: [String]!
		$propertyNumbers: [String]!
		$propertyCount: Float!
		$checkCount: Float!
		$checkDetailCount: Float!
	) {
		verifyCheckDetailsJob(
			sourceId: $sourceId
			purchaserName: $purchaserName
			propertyNames: $propertyNames
			propertyNumbers: $propertyNumbers
			propertyCount: $propertyCount
			checkCount: $checkCount
			checkDetailCount: $checkDetailCount
		) {
			success
			message
			data
		}
	}
`;
