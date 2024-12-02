import gql from 'graphql-tag';

export const GET_VIEW_TOKEN_URI = gql`
	query getViewTokenUri($fileId: String) {
		getViewTokenUri(fileId: $fileId)
	}
`;
