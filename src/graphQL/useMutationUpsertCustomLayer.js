import gql from 'graphql-tag';

export const UPSERTCUSTOMLAYER = gql`
	mutation UpsertCustomLayer($customLayer: CustomLayerInput, $userId: JSON) {
		upsertCustomLayer(customLayer: $customLayer, userId: $userId) {
			success
			message
			customLayer {
				_id
				shape
				shapeJson
				qtrQtrSelection
				name
				layer
				user {
					_id
					name
					email
				}
			}
		}
	}
`;
