import gql from 'graphql-tag';

export const UPDATE_DOCUMENT = gql`
	mutation updateDocument($document: DocumentInput) {
		updateDocumentFile(document: $document) {
			success
			message
			error
		}
	}
`;

export const UPDATE_PDF_TEXTS = gql`
	mutation updatePDFText($fileId: ID, $texts: [String]) {
		updatePDFText(fileId: $fileId, texts: $texts) {
			success
			message
			error
		}
	}
`;
