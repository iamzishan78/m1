import gql from 'graphql-tag';

export const CUSTOMLAYER = gql`
	query getCustomLayer($id: ID, $key: String, $value: String) {
		customLayer(id: $id, key: $key, value: $value) {
			_id
			shapeJson
			qtrQtrSelection
			shape
			name
			layer
			state
			user {
				_id
			}
			ownerCount
		}
	}
`;
