import gql from 'graphql-tag';

export const GET_WELL_DESCRIPTORS = gql`
	query getWellsDescriptors($relatedObject: ID) {
		getWellsDescriptors(relatedObject: $relatedObject)
	}
`;

export const GET_WELL_PROPERTY_INTERESTS = gql`
	query getWellPropertyInterest($descriptorObject: ID) {
		getWellPropertyInterest(descriptorObject: $descriptorObject) {
			_id
			properties
		}
	}
`;

export const GET_SHAPE_WELL_INTEREST = gql`
	query getShapeWellInterest($descriptorObject: ID) {
		getShapeWellInterest(descriptorObject: $descriptorObject) {
			_id
			shapeObj
		}
	}
`;
