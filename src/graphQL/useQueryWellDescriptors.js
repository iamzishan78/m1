import gql from 'graphql-tag';

export const GET_WELL_DESCRIPTORS = gql`
	query getWellsDescriptors($relatedObject: ID) {
		getWellsDescriptors(relatedObject: $relatedObject)
	}
`;
