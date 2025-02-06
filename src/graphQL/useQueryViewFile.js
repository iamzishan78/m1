import gql from 'graphql-tag';

export const VIEWFILEQUERY = gql`
	query viewFile($fileId: ID) {
		viewFile(fileId: $fileId) {
			id
			name
			uri
			internalKey
		}
	}
`;

export const VIEWFILESQUERY = gql`
	query viewFiles($fileIds: [ID]) {
		viewFiles(fileIds: $fileIds) {
			id
			name
			uri
			internalKey
		}
	}
`;

export const GET_FILE_OCR_TEXT = gql`
	query getFileOCRText($fileId: ID) {
		getFileOCRText(fileId: $fileId) {
			success
			message
			error
			data
		}
	}
`;
