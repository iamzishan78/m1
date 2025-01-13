import gql from 'graphql-tag';

export const UPSERT_WELL_DESCRIPTOR = gql`
	mutation upsertWellDescriptor($well: JSON, $relatedObject: ID, $relatedObjectType: String) {
		upsertWellDescriptor(well: $well, relatedObject: $relatedObject, relatedObjectType: $relatedObjectType)
	}
`;

export const DELETE_WELL_DESCRIPTOR = gql`
	mutation deleteWellDescriptor($descriptorObject: ID, $relatedObject: ID) {
		deleteWellDescriptor(descriptorObject: $descriptorObject, relatedObject: $relatedObject)
	}
`;
