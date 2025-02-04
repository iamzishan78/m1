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

export const PARSE_PDF_TEXTS = gql`
	mutation parsePDFText($fileId: ID) {
		parsePDFText(fileId: $fileId) {
			success
			message
			error
		}
	}
`;
export const UPDATE_PDF_TEXTS = gql`
	mutation updatePDFText($fileId: ID, $lineTexts: [JSON], $pageTexts: [JSON]) {
		updatePDFText(fileId: $fileId, lineTexts: $lineTexts, pageTexts: $pageTexts) {
			success
			message
			error
		}
	}
`;
