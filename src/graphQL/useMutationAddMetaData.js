import gql from 'graphql-tag';

export const ADD_META_DATA = gql`
	mutation addMetaData($metaData: metaDataInput) {
		addMetaData(metaData: $metaData)
	}
`;
