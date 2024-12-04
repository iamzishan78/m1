import gql from 'graphql-tag';

export const UPDATE_META_DATA = gql`
	mutation updateMetaData($metaData: metaDataInput) {
		updateMetaData(metaData: $metaData)
	}
`;
